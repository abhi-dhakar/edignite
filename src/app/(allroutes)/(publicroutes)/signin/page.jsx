'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signinSchema } from '@/lib/validations/signinSchema';
import Image from 'next/image';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  HeartHandshake,
  AlertCircle
} from 'lucide-react';

export default function SigninPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = signinSchema.safeParse(formData);

    if (!result.success) {
      const errorFields = result.error.flatten().fieldErrors;
      setError(errorFields.email?.[0] || errorFields.password?.[0] || 'Invalid input');
      setLoading(false);
      return;
    }

    const res = await signIn('credentials', {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (res?.error) {
      setError('Invalid email or password.');
    } else {
      router.push('/');
    }

    setLoading(false);
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
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-500">

        {/* Left Side - Hero / Branding */}
        <div className="md:w-5/12 bg-gradient-to-br from-myColorA to-emerald-800 p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-black/10 blur-2xl"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 mb-6 text-emerald-100 font-semibold tracking-wider uppercase text-sm">
              <HeartHandshake className="w-5 h-5" />
              <span>Welcome Back</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold leading-tight mb-4">
              Continue Your Impact Journey
            </h2>
            <p className="text-emerald-100/90 leading-relaxed text-sm lg:text-base">
              "The best way to find yourself is to lose yourself in the service of others."
            </p>
          </div>

          <div className="relative z-10 mt-12">
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
              <p className="text-emerald-50 text-xs font-medium">Trusted by 10,000+ volunteers and donors worldwide.</p>
            </div>
          </div>
        </div>

        {/* Right Side - Form Content */}
        <div className="md:w-7/12 p-8 lg:p-12 bg-white flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Sign In</h1>
            <p className="text-slate-500 mb-8 text-sm">Enter your credentials to access your account.</p>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-myColorA focus:border-myColorA transition-all placeholder:text-slate-400"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Password</label>
                  <Link href="/forgot-password" className="text-xs font-medium text-myColorA hover:text-myColorAB">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-9 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-myColorA focus:border-myColorA transition-all placeholder:text-slate-400"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 border border-red-100 animate-in slide-in-from-top-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-myColorA hover:bg-myColorAB text-white rounded-lg font-bold shadow-lg shadow-myColorA/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-400 font-medium text-xs uppercase tracking-wide">Or continue with</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 text-center mt-4">
                Social login coming soon 🚀
              </p>

            </div>

            <div className="text-center mt-8">
              <p className="text-slate-500 text-sm">
                Don't have an account? <Link className="text-myColorA font-semibold hover:text-myColorAB hover:underline" href="/signup">Create Account</Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}