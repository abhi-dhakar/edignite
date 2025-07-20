"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { signupSchema } from "@/lib/validations/signupSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";


export default function SignupPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  
  // Two-step upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ step: 'idle', percent: 0 });
  const [tempFilePath, setTempFilePath] = useState(null);
  
  // OTP verification state
  const [step, setStep] = useState("register"); // "register" or "verify"
  const [otp, setOtp] = useState("");
  const [formDataCache, setFormDataCache] = useState(null);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      memberType: "Volunteer",
    },
  });



  // Step 1: Upload to temporary storage
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      setSubmitError("Image must be less than 5MB");
      return;
    }
    
    if (!file.type.startsWith("image/")) {
      setSubmitError("Please upload an image file");
      return;
    }
    
    // Show local preview immediately
    setProfileImage(file);
    setImagePreview(URL.createObjectURL(file));
    setSubmitError("");
    
    // Upload to temp storage
    await uploadToTempStorage(file);
  };
  
  // Upload image to temporary storage
  const uploadToTempStorage = async (file) => {
    setIsUploading(true);
    setUploadProgress({ step: 'local', percent: 0 });
    
    try {
      const formData = new FormData();
      formData.append('image', file);

      if(tempFilePath){
         formData.append('previousFilePath', tempFilePath);
      }
      
      // Upload with progress tracking
      const response = await axios.post('/api/upload/temp-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress({ step: 'local', percent: percentCompleted });
        }
      });
      
      if (response.data.success) {
        setTempFilePath(response.data.tempFile.path);
        setUploadProgress({ step: 'localComplete', percent: 100 });
      } else {
        throw new Error(response.data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Temp upload error:", error);
      setSubmitError("Failed to upload image. Please try again.");
      setUploadProgress({ step: 'error', percent: 0 });
    } finally {
      setIsUploading(false);
    }
  };

  // Send OTP for verification
  const onSubmit = async (formData) => {
    setLoading(true);
    setSubmitError("");

    try {
      // Cache form data for later use during verification
      setFormDataCache({
        ...formData,
        tempFilePath: tempFilePath // Store temp file path instead of actual file
      });

      // Send OTP
      const response = await axios.post("/api/auth/send-otp", {
        email: formData.email,
        name: formData.name,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        memberType: formData.memberType,
      });

      if (response.data.success) {
        // Move to verification step
        setStep("verify");
        startResendCountdown();
      } else {
        setSubmitError("Failed to send verification code. Please try again.");
      }
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Upload image from temp to Cloudinary
  const uploadToCloudinary = async (userId) => {
    if (!tempFilePath) return null;
    
    setUploadProgress({ step: 'cloudinary', percent: 0 });
    setIsUploading(true);
    
    try {
      const response = await axios.post('/api/upload/upload-to-cloudinary', {
        userId,
        tempFilePath,
        folder: 'user-profiles'
      });
      
      if (response.data.success) {
        setUploadProgress({ step: 'complete', percent: 100 });
        return response.data.imageUrl;
      } else {
        throw new Error(response.data.message || "Cloudinary upload failed");
      }
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      setSubmitError("Profile image couldn't be processed, but your account was created.");
      setUploadProgress({ step: 'error', percent: 0 });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Verify OTP and complete registration
  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setSubmitError("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    setSubmitError("");

    try {
      // Verify OTP
      const verifyResponse = await axios.post("/api/auth/verify-otp", {
        email: formDataCache.email,
        otp: otp
      });

      if (verifyResponse.data.success) {
        const userId = verifyResponse.data.user.id;
        
       // Upload image to Cloudinary from temp file if we have one
      if (tempFilePath) {
        try {
          await uploadToCloudinary(userId);
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          // Don't stop the registration process, just show a message
          setSubmitError("Your account was created, but profile image couldn't be uploaded.");
        }
      }

        // Log the user in
        await signIn("credentials", {
          email: formDataCache.email,
          password: formDataCache.password,
          redirect: false,
        });
        
        router.push("/");
      } else {
        setSubmitError("Verification failed. Please try again.");
      }
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle resend OTP functionality
  const resendOTP = async () => {
    if (resendDisabled) return;
    
    setLoading(true);
    setSubmitError("");
    
    try {
      const response = await axios.post("/api/auth/resend-otp", {
        email: formDataCache.email
      });
      
      if (response.data.success) {
        setSubmitError(""); // Clear any existing errors
        startResendCountdown();
      } else {
        setSubmitError("Failed to resend verification code. Please try again.");
      }
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Failed to resend verification code.");
    } finally {
      setLoading(false);
    }
  };

  // Countdown timer for resend button
  const startResendCountdown = () => {
    setResendDisabled(true);
    setCountdown(60);
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto my-12 bg-white rounded-xl shadow-md overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/3 bg-myColorA p-8 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Join Our Community</h2>
            <p className="text-green-100">Together we can make a difference</p>
          </div>
        </div>

        <div className="md:w-2/3 p-8">
          <h1 className="text-2xl font-bold text-myColorAB mb-6">
            {step === "register" ? "Create Your Account" : "Email Verification"}
          </h1>

          {step === "register" ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Profile Image */}
              <div className="mb-6 flex flex-col items-center">
                <div
                  className="w-28 h-28 rounded-full mb-3 bg-gray-100 border-2 border-myColorA flex items-center justify-center overflow-hidden cursor-pointer relative"
                  onClick={() => fileInputRef.current.click()}
                >
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      {isUploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
                          <div className="text-white text-xs font-bold mb-1">
                            {uploadProgress.step === 'local' && 'Uploading...'}
                            {uploadProgress.step === 'localComplete' && 'Ready'}
                            {uploadProgress.step === 'cloudinary' && 'Processing...'}
                            {uploadProgress.step === 'error' && 'Failed'}
                          </div>
                          <div className="w-16 h-1 bg-gray-300 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-white" 
                              style={{ width: `${uploadProgress.percent}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="text-sm text-myColorA hover:text-myColorAB"
                  disabled={isUploading}
                >
                  {isUploading 
                    ? "Uploading..." 
                    : imagePreview 
                      ? (tempFilePath ? "Change Photo" : "Upload Failed - Try Again") 
                      : "Add Profile Photo"}
                </button>
              </div>

              {/* Name + Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
                  <input
                    {...register("name")}
                    type="text"
                    placeholder="Your Name"
                    className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-green-500"
                  />
                  {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="you@example.com"
                    className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-green-500"
                  />
                  {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password*</label>
                <input
                  {...register("password")}
                  type="password"
                  placeholder="Create a strong password"
                  className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-green-500"
                />
                {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
              </div>

              {/* Phone + MemberType */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    {...register("phone")}
                    type="text"
                    placeholder="Phone number"
                    className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">How You'll Participate*</label>
                  <select
                    {...register("memberType")}
                    className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Volunteer">Volunteer</option>
                    <option value="Donor">Donor</option>
                    <option value="Sponsor">Sponsor</option>
                    <option value="Beneficiary">Beneficiary</option>
                  </select>
                  {errors.memberType && <p className="text-sm text-red-600">{errors.memberType.message}</p>}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  {...register("address")}
                  type="text"
                  placeholder="Your address"
                  className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-green-500"
                />
              </div>

              {submitError && <p className="text-red-600 text-sm">{submitError}</p>}

              <div className="flex flex-col items-center mt-6">
                <button
                  type="submit"
                  disabled={loading || isUploading}
                  className="w-full py-3 bg-myColorA rounded-md text-white font-medium hover:bg-myColorAB disabled:opacity-50"
                >
                  {loading ? "Sending Verification..." : "Continue"}
                </button>

                <p className="mt-4 text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link href="/signin" className="text-myColorA hover:text-myColorAB font-medium">
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center bg-green-100 rounded-full p-2 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-myColorA" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Verify Your Email</h2>
                <p className="text-gray-600 mt-2">
                  We've sent a verification code to <span className="font-medium">{formDataCache?.email}</span>
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enter 6-digit Verification Code</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                    placeholder="123456"
                    className="w-full p-3 text-center text-lg tracking-widest rounded border border-gray-300 focus:ring-2 focus:ring-green-500"
                    maxLength={6}
                  />
                </div>

                {submitError && <p className="text-red-600 text-sm">{submitError}</p>}
                
                {isUploading && (
                  <div className="bg-blue-50 p-3 rounded-md flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-myColorA mr-2"></div>
                    <p className="text-sm text-blue-800">
                      Processing your profile image...
                    </p>
                  </div>
                )}

                <div className="flex flex-col items-center">
                  <button
                    onClick={verifyOTP}
                    disabled={loading || isUploading || otp.length !== 6}
                    className="w-full py-3 bg-myColorA rounded-md text-white font-medium hover:bg-myColorAB disabled:opacity-50"
                  >
                    {loading ? "Verifying..." : "Complete Registration"}
                  </button>

                  <div className="flex justify-between w-full mt-4">
                    <button
                      type="button"
                      onClick={() => setStep("register")}
                      className="text-sm text-gray-600 hover:text-gray-800"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={resendOTP}
                      disabled={resendDisabled}
                      className={`text-sm ${resendDisabled ? 'text-gray-400' : 'text-myColorA hover:text-myColorAB'}`}
                    >
                      {resendDisabled ? `Resend in ${countdown}s` : "Resend Code"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <p className="mt-8 text-xs text-gray-500 text-center">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}