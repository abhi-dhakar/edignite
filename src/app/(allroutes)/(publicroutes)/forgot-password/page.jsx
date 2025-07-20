"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

// Step-specific validation schemas
const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" })
});

const otpSchema = z.object({
  otp: z.string().length(6, { message: "Verification code must be 6 digits" })
});

const passwordSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100, { message: "Password cannot exceed 100 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, { 
      message: "Password must contain at least one uppercase letter, one lowercase letter, and one number" 
    }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export default function PasswordResetPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState("email"); // "email", "otp", "password"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [success, setSuccess] = useState(false);
  
  // Initialize forms for each step
  const emailForm = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" }
  });
  
  const otpForm = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" }
  });
  
  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirmPassword: "" }
  });
  
  // Step 1: Request password reset
  const handleEmailSubmit = async (data) => {
    setLoading(true);
    setError("");
    
    try {
      const response = await axios.post("/api/auth/forgot-password", {
        email: data.email
      });
      
      if (response.data.success) {
        setEmail(data.email);
        setCurrentStep("otp");
        startResendCountdown();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  
  // Step 2: Verify OTP
  const handleOtpSubmit = async (data) => {
    setLoading(true);
    setError("");
    
    try {
      // First verify the OTP is correct
      const response = await axios.post("/api/auth/verify-reset-otp", {
        email: email,
        otp: data.otp
      });
      
      // Only proceed if verification is successful
      if (response.data.success) {
        setOtp(data.otp);
        setCurrentStep("password");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };
  
  // Step 3: Set new password
  const handlePasswordSubmit = async (data) => {
    setLoading(true);
    setError("");
    
    try {
      const response = await axios.post("/api/auth/reset-password", {
        email: email,
        otp: otp,
        password: data.password,
        confirmPassword: data.confirmPassword
      });
      
      if (response.data.success) {
        setSuccess(true);
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/signin");
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
      
      // If OTP has expired during password step, go back to email step
      if (err.response?.status === 400 && 
          err.response?.data?.message?.includes("expired")) {
        setCurrentStep("email");
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Handle resend OTP
  const handleResendOtp = async () => {
    if (resendDisabled) return;
    
    setLoading(true);
    setError("");
    
    try {
      const response = await axios.post("/api/auth/forgot-password", {
        email: email
      });
      
      if (response.data.success) {
        startResendCountdown();
        setError(""); // Clear any previous errors
        toast.success("New verification code sent");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend code");
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
  
  // Success screen
  if (success) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <div className="inline-flex items-center justify-center bg-green-100 rounded-full p-3 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-green-600 mb-6">Password Reset Complete</h1>
        <p className="text-gray-600 mb-4 text-center">
          Your password has been successfully reset.
        </p>
        <p className="text-gray-600 mb-6 text-center">
          You will be redirected to the login page shortly...
        </p>
        <div className="flex justify-center">
          <Link href="/signin" className="bg-myColorA text-white px-4 py-2 rounded hover:bg-myColorAB">
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto my-18 p-12 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-center text-myColorA mb-6">
        {currentStep === "email" && "Reset Your Password"}
        {currentStep === "otp" && "Verify Your Email"}
        {currentStep === "password" && "Create New Password"}
      </h1>
      
      {/* Step 1: Enter Email */}
      {currentStep === "email" && (
        <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              {...emailForm.register("email")}
              className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-myColorA"
              placeholder="Enter your email"
            />
            {emailForm.formState.errors.email && (
              <p className="text-red-600 text-sm mt-1">{emailForm.formState.errors.email.message}</p>
            )}
          </div>
          
          {error && <p className="text-red-600 text-sm">{error}</p>}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-myColorA rounded-md text-white font-medium hover:bg-myColorAB disabled:opacity-50"
          >
            {loading ? "Sending OTP ..." : "Send OTP"}
          </button>
          
          <div className="text-center mt-2">
            <Link href="/signin" className="text-sm text-myColorA hover:text-myColorAB">
              Back to Sign In
            </Link>
          </div>
        </form>
      )}
      
      {/* Step 2: Enter OTP */}
      {currentStep === "otp" && (
        <div className="space-y-4">
          <p className="text-gray-600 mb-4">
            We've sent a verification code to <span className="font-medium">{email}</span>
          </p>
          
          <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Verification Code
              </label>
              <input
                type="text"
                {...otpForm.register("otp")}
                className="w-full p-3 text-center text-lg tracking-widest rounded border border-gray-300 focus:ring-2 focus:ring-myColorA"
                placeholder="123456"
                maxLength={6}
              />
              {otpForm.formState.errors.otp && (
                <p className="text-red-600 text-sm mt-1">{otpForm.formState.errors.otp.message}</p>
              )}
            </div>
            
            {error && <p className="text-red-600 text-sm">{error}</p>}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-myColorA rounded-md text-white font-medium hover:bg-myColorAB disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </form>
          
          <div className="flex justify-between text-sm">
            <button
              type="button"
              onClick={() => setCurrentStep("email")}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Change Email
            </button>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendDisabled}
              className={resendDisabled ? 'text-gray-400' : 'text-myColorA hover:text-myColorAB'}
            >
              {resendDisabled ? `Resend in ${countdown}s` : "Resend Code"}
            </button>
          </div>
        </div>
      )}
      
      {/* Step 3: Create New Password */}
      {currentStep === "password" && (
        <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              {...passwordForm.register("password")}
              className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-myColorA"
              placeholder="Enter new password"
            />
            {passwordForm.formState.errors.password && (
              <p className="text-red-600 text-sm mt-1">{passwordForm.formState.errors.password.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              {...passwordForm.register("confirmPassword")}
              className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-myColorA"
              placeholder="Confirm new password"
            />
            {passwordForm.formState.errors.confirmPassword && (
              <p className="text-red-600 text-sm mt-1">{passwordForm.formState.errors.confirmPassword.message}</p>
            )}
          </div>
          
          {error && <p className="text-red-600 text-sm">{error}</p>}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-myColorA rounded-md text-white font-medium hover:bg-myColorAB disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
          
          <button
            type="button"
            onClick={() => setCurrentStep("otp")}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            ← Back to Verification
          </button>
        </form>
      )}
    </div>
  );
}