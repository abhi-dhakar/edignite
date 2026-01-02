"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { signupSchema } from "@/lib/validations/signupSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import {
  Loader2,
  UploadCloud,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HeartHandshake
} from "lucide-react";
import Image from "next/image";

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

      if (tempFilePath) {
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
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-900">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/children-banner.webp"
          alt="Community Background"
          fill
          className="object-cover opacity-60"
          quality={85}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-900/60 backdrop-blur-[2px]" />
      </div>

      {/* Main Card Container */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-500">

        {/* Left Side - Hero / Branding */}
        <div className="md:w-2/5 bg-gradient-to-br from-myColorA to-emerald-800 p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-black/10 blur-2xl"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 mb-6 text-emerald-100 font-semibold tracking-wider uppercase text-sm">
              <HeartHandshake className="w-5 h-5" />
              <span>Join the Movement</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold leading-tight mb-4">
              Be the Change You Wish to See
            </h2>
            <p className="text-emerald-100/90 leading-relaxed">
              Create an account to track your impact, manage donations, and connect with a community dedicated to making a difference.
            </p>
          </div>

          <div className="relative z-10 mt-12">
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm font-medium text-emerald-50/90">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">1</div>
                <span>Create your compassionate profile</span>
              </div>
              <div className="flex items-center gap-4 text-sm font-medium text-emerald-50/90">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">2</div>
                <span>Verify your identity securely</span>
              </div>
              <div className="flex items-center gap-4 text-sm font-medium text-emerald-50/90">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">3</div>
                <span>Start making a real impact</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form Content */}
        <div className="md:w-3/5 p-8 lg:p-12 bg-white">
          <div className="max-w-md mx-auto">

            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              {step === "register" ? "Create Your Account" : "Verify Email Address"}
            </h1>
            <p className="text-slate-500 mb-8 text-sm">
              {step === "register"
                ? "Fill in your details to get started with your journey."
                : "We have sent a 6-digit code to your email."}
            </p>

            {step === "register" ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                {/* Profile Image Section */}
                <div className="flex flex-col items-center mb-6">
                  <div
                    className="relative group cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className={`w-24 h-24 rounded-full overflow-hidden border-4 transition-all duration-300 ${isUploading ? 'border-myColorA' : 'border-slate-100 group-hover:border-myColorA'}`}>
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-myColorA transition-colors">
                          <User className="w-10 h-10" />
                        </div>
                      )}

                      {/* Upload Overlay */}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <UploadCloud className="w-8 h-8 text-white" />
                      </div>

                      {/* Loading Overlay */}
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                          <Loader2 className="w-6 h-6 text-white animate-spin mb-1" />
                          <span className="text-[10px] font-bold text-white">{uploadProgress.percent}%</span>
                        </div>
                      )}
                    </div>

                    <button type="button" className="mt-2 text-xs font-medium text-myColorA hover:text-myColorAB text-center w-full">
                      {imagePreview ? 'Change image' : 'Upload image'}
                    </button>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Input Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        {...register("name")}
                        type="text"
                        placeholder="Enter your name"
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-myColorA focus:border-myColorA transition-all placeholder:text-slate-400"
                      />
                    </div>
                    {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="Enter your email"
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-myColorA focus:border-myColorA transition-all placeholder:text-slate-400"
                      />
                    </div>
                    {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        {...register("password")}
                        type="password"
                        placeholder="Enter password"
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-myColorA focus:border-myColorA transition-all placeholder:text-slate-400"
                      />
                    </div>
                    {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        {...register("phone")}
                        type="tel"
                        placeholder="Enter phone number"
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-myColorA focus:border-myColorA transition-all placeholder:text-slate-400"
                      />
                    </div>
                    {errors.phone && <p className="text-xs text-red-500 font-medium">{errors.phone.message}</p>}
                  </div>

                  {/* Role Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">I am a</label>
                    <div className="relative">
                      <select
                        {...register("memberType")}
                        className="w-full pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-myColorA focus:border-myColorA transition-all appearance-none cursor-pointer"
                      >
                        <option value="Volunteer">Volunteer</option>
                        <option value="Donor">Donor</option>
                        <option value="Sponsor">Sponsor</option>
                        <option value="Beneficiary">Beneficiary</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        {...register("address")}
                        type="text"
                        placeholder="Your full address"
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-myColorA focus:border-myColorA transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {submitError && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 border border-red-100">
                    <AlertCircle className="w-4 h-4" />
                    {submitError}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || isUploading}
                  className="w-full py-3 bg-myColorA hover:bg-myColorAB text-white rounded-lg font-bold shadow-lg shadow-myColorA/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Create Account <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <div className="text-center mt-6">
                  <p className="text-slate-500 text-sm">
                    Already have an account?{' '}
                    <Link href="/signin" className="text-myColorA font-semibold hover:underline">
                      Sign In
                    </Link>
                  </p>
                </div>
              </form>
            ) : (
              // Verification Step UI
              <div className="space-y-6 animate-in slide-in-from-right-10 duration-300">
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-myColorA">
                    <Mail className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">Check your inbox</h3>
                  <p className="text-slate-500 text-center max-w-[280px]">
                    We sent a verification code to <span className="font-semibold text-slate-700">{formDataCache?.email}</span>
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2 text-center">Verification Code</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                      placeholder="000 000"
                      className="w-full p-4 text-center text-3xl font-bold tracking-[0.5em] text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-myColorA focus:border-myColorA transition-all placeholder:text-slate-300"
                      maxLength={6}
                      autoFocus
                    />
                  </div>

                  {submitError && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 border border-red-100 justify-center">
                      <AlertCircle className="w-4 h-4" />
                      {submitError}
                    </div>
                  )}

                  {isUploading && (
                    <div className="p-3 bg-blue-50 text-blue-700 text-sm rounded-lg flex items-center justify-center gap-2 border border-blue-100">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Finalizing profile setup...
                    </div>
                  )}

                  <button
                    onClick={verifyOTP}
                    disabled={loading || isUploading || otp.length !== 6}
                    className="w-full py-3 bg-myColorA hover:bg-myColorAB text-white rounded-lg font-bold shadow-lg shadow-myColorA/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify & Complete <CheckCircle2 className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setStep("register")}
                    className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    ← Back to details
                  </button>

                  <button
                    type="button"
                    onClick={resendOTP}
                    disabled={resendDisabled}
                    className="text-sm font-medium text-myColorA hover:text-myColorAB disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {resendDisabled ? `Resend in ${countdown}s` : "Resend Code"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}