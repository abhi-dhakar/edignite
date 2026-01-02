"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const socialLinks = [
  { icon: Facebook, href: "https://www.facebook.com/socialindiagroup.in", color: "hover:text-blue-500", label: "Facebook" },
  { icon: Instagram, href: "https://www.instagram.com/ed_ignite", color: "hover:text-pink-500", label: "Instagram" },
  { icon: Linkedin, href: "https://in.linkedin.com/company/edignite-ngo", color: "hover:text-blue-600", label: "LinkedIn" },
  { icon: Twitter, href: "#", color: "hover:text-sky-400", label: "Twitter" },
];

export default function ContactPage() {
  const { data: session } = useSession();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    type: "Contact",
  });

  const ourinfo = {
    headline: "Reach out through the form or use our direct contact details below.",
    phoneNumber: "+91 9403628175",
    email: "contact@edignitengo.org",
    address: "Surat-395007, Gujarat, India",
  };

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: session.user.name || "",
        email: session.user.email || "",
      }));
    }
  }, [session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await axios.post("/api/user-message", formData);
      setSuccess(true);
      setFormData({
        name: session?.user?.name || "",
        email: session?.user?.email || "",
        message: "",
        type: "Contact",
      });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">

      {/* Hero Section with Background Image */}
      {/* Hero Section: Uses 'empowerment.png' for emotional impact, matching the NGO mission. 
          The overlay (slate-900 gradient) ensures text readability while maintaining a warm, serious tone. */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden bg-slate-900">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero/empowerment.png"
            alt="Community connection"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-200 text-xs font-bold uppercase tracking-[0.2em] mb-6">
              <Sparkles className="h-4 w-4" />
              We're Here to Listen
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Let’s Make an <span className="text-myColorA">Impact</span> Together
            </h1>
            <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed font-medium">
              Whether you have a question, an idea, or want to volunteer, your voice matters to us.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-20 px-4 md:px-12 relative bg-slate-50">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-20 items-start">

            {/* Left Column: Contact Info Cards */}
            <div className="lg:col-span-2 space-y-10">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Get in Touch</h2>
                <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                  "{ourinfo.headline}"
                </p>

                <div className="space-y-5">
                  {[
                    { icon: Phone, label: "Call Us", value: ourinfo.phoneNumber, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
                    { icon: Mail, label: "Email Us", value: ourinfo.email, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
                    { icon: MapPin, label: "Visit Us", value: ourinfo.address, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
                      className={`flex items-start gap-5 p-5 rounded-2xl bg-white border ${item.border} shadow-sm transition-all`}
                    >
                      <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shrink-0", item.bg, item.color)}>
                        <item.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{item.label}</h3>
                        <p className="text-slate-900 font-semibold leading-snug">{item.value}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Socials */}
              <div className="pt-8 border-t border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6">Connect With Us</h3>
                <div className="flex gap-4">
                  {socialLinks.map((social, i) => (
                    <a
                      key={i}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "h-12 w-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300",
                        social.color
                      )}
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Glassmorphism Form Card */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                {/* Decorative Blur blob */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-myColorA/20 rounded-full blur-3xl opacity-50" />

                <div className="relative bg-white/80 backdrop-blur-xl border border-white/40 p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50">
                  <div className="mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Send a Message</h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-myColorA to-emerald-400 rounded-full" />
                  </div>

                  {success && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mb-8 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-800"
                    >
                      <CheckCircle2 className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                      <p className="font-medium text-sm">Thank you! We have received your message.</p>
                    </motion.div>
                  )}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-800"
                    >
                      <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
                      <p className="font-medium text-sm">{error}</p>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
                        <Input
                          name="name"
                          placeholder="Your Name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="h-12 bg-slate-50 border-slate-200 rounded-xl px-4 focus:ring-2 focus:ring-myColorA focus:border-myColorA transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
                        <Input
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="h-12 bg-slate-50 border-slate-200 rounded-xl px-4 focus:ring-2 focus:ring-myColorA focus:border-myColorA transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Topic</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-myColorA focus:border-myColorA transition-all appearance-none"
                      >
                        <option value="Contact">General Inquiry</option>
                        <option value="Suggestion">Suggestion</option>
                        <option value="Feedback">Feedback</option>
                        <option value="Volunteer">Volunteer Interest</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Your Message</label>
                      <Textarea
                        name="message"
                        placeholder="How can we help?"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        className="min-h-[160px] bg-slate-50 border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-myColorA focus:border-myColorA transition-all resize-y"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-14 bg-myColorA hover:bg-myColorAB text-white rounded-xl shadow-lg shadow-myColorA/20 hover:shadow-myColorA/40 transition-all text-base font-bold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                    >
                      {loading ? "Sending..." : (
                        <>
                          Send Message <Send className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Ready to join our community?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild className="h-14 px-8 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-base font-bold">
              <a href="/volunteer">Volunteer Now <ArrowRight className="ml-2 h-4 w-4" /></a>
            </Button>
            <Button asChild variant="outline" className="h-14 px-8 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 text-base font-bold">
              <a href="/donate">Make a Donation</a>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
