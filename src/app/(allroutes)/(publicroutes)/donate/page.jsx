"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Heart,
  CreditCard,
  ShieldCheck,
  Users,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const PRESET_AMOUNTS = [500, 1000, 2000, 5000];

export default function DonationPage() {
  const { data: session } = useSession();

  const [amount, setAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState("");
  const [isCustom, setIsCustom] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill user data if session exists
  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: "", // Phone might not be in session
      });
    }
  }, [session]);

  const handleAmountChange = (val) => {
    setAmount(val);
    setIsCustom(false);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e) => {
    const val = e.target.value;
    if (val === "" || /^\d+$/.test(val)) {
      setCustomAmount(val);
      setAmount(Number(val));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const finalAmount = isCustom ? Number(customAmount) : amount;

    if (!finalAmount || finalAmount < 10) {
      toast.error("Please enter an amount of at least ₹10");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        amount: finalAmount,
        currency: "INR",
        ...(!session?.user && {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        })
      };

      const response = await axios.post("/api/donations", payload);

      if (response.data.success) {
        setSuccess(true);
        toast.success("Thank you for your generous donation!");
      } else {
        setError(response.data.message || "Something went wrong.");
        toast.error(response.data.message || "Donation failed.");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to process donation. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-4">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Thank You!</h1>
          <p className="text-gray-600 text-lg">
            Your generous contribution of <span className="font-bold text-myColorA">₹{isCustom ? customAmount : amount}</span> will make a significant difference in our community projects.
          </p>
          <div className="pt-6">
            <Button
              onClick={() => window.location.href = "/"}
              className="bg-myColorA hover:bg-myColorAB text-white px-8 py-6 text-lg rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              Return Home
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero Header */}
      <div className="bg-myColorA py-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 opacity-10">
          <Heart size={400} fill="white" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-white mb-6"
          >
            Empower Change with Your Kindness
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sky-50 text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Every rupee you donate helps us provide education, healthcare, and essential support to those who need it most.
          </motion.p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-10 pb-20">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Left Column: Donation Impact Info */}
          <div className="lg:col-span-2 space-y-8 pt-10">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <TrendingUp className="text-myColorA" /> Your Impact
              </h2>

              <div className="grid gap-4">
                {[
                  { icon: Button, label: "₹500", text: "Provides educational books for one child for a month." },
                  { icon: Users, label: "₹2000", text: "Supports a family with nutritional food supplies." },
                  { icon: ShieldCheck, label: "₹5000", text: "Funds an entire community health workshop." }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-myColorA font-bold">
                      {item.label}
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium">{item.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-myColorA to-myColorAB rounded-2xl text-white shadow-xl shadow-sky-200">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ShieldCheck /> Secure & Transparent
              </h3>
              <p className="text-sky-50 mb-4 text-sm opacity-90">
                Edignite ensures 100% transparency. You'll receive a detailed impact report and a donation receipt for your records.
              </p>
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-sky-200 overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="avatar" />
                  </div>
                ))}
                <div className="ml-4 text-xs font-medium flex items-center">
                  Joined by 2,000+ donors
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Donation Form */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-none shadow-2xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-white border-b border-gray-100 p-8">
                  <CardTitle className="text-2xl font-bold text-gray-800">Choose Donation Amount</CardTitle>
                  <CardDescription>Select a preset amount or enter a custom value</CardDescription>
                </CardHeader>

                <CardContent className="p-8 space-y-8">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {PRESET_AMOUNTS.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleAmountChange(amt)}
                        className={`py-4 px-2 rounded-2xl font-bold text-lg border-2 transition-all duration-200 ${amount === amt && !isCustom
                            ? "bg-myColorA border-myColorA text-white shadow-lg shadow-sky-100 scale-105"
                            : "bg-white border-gray-200 text-gray-600 hover:border-myColorA hover:text-myColorA"
                          }`}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustom(true);
                        setAmount(Number(customAmount) || 0);
                      }}
                      className={`w-full py-4 text-center font-semibold rounded-2xl border-2 transition-all ${isCustom
                          ? "border-myColorA bg-sky-50 text-myColorA"
                          : "border-dashed border-gray-300 text-gray-400 hover:border-myColorA hover:text-myColorA"
                        }`}
                    >
                      {isCustom ? "Custom Amount Selected" : "+ Enter Custom Amount"}
                    </button>

                    <AnimatePresence>
                      {isCustom && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-4 overflow-hidden"
                        >
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-400">₹</span>
                            <Input
                              type="text"
                              placeholder="Enter amount (Min ₹10)"
                              value={customAmount}
                              onChange={handleCustomAmountChange}
                              className="pl-10 h-14 text-xl font-bold rounded-xl border-2 focus:border-myColorA focus:ring-myColorA"
                              autoFocus
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <hr className="border-gray-100" />

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                        <Users size={20} className="text-gray-400" />
                        Personal Details
                      </h3>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            className="h-12 rounded-xl bg-gray-50/50 border-gray-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="john@example.com"
                            className="h-12 rounded-xl bg-gray-50/50 border-gray-200"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number (Optional)</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+91 9876543210"
                          className="h-12 rounded-xl bg-gray-50/50 border-gray-200"
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-16 bg-myColorA hover:bg-myColorAB text-white text-xl font-bold rounded-2xl transition-all shadow-xl shadow-sky-100 hover:shadow-2xl hover:-translate-y-1 active:scale-95"
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="animate-spin" /> Processing...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            Donate ₹{isCustom ? (customAmount || 0) : amount} <ChevronRight />
                          </div>
                        )}
                      </Button>
                      <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                        <ShieldCheck size={12} /> Secure transaction powered by Edignite
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}