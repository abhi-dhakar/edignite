"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { motion } from "framer-motion";
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
    phoneNumber: "+91 1234 567 890",
    email: "contact@edignite.org",
    address: "B-66 Ashish Row House, Variyav Road, Surat-395007",
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
    <div className="bg-white min-h-screen overflow-hidden">

      {/* Immersive Hero Section */}
      <section className="relative h-[45vh] md:h-[50vh] flex items-center justify-center overflow-hidden bg-slate-950 px-6">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-white" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-myColorA/20 via-transparent to-transparent opacity-50" />
        </div>

        <div className="relative z-10 container mx-auto text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-black uppercase tracking-[0.3em] mb-8">
              <Sparkles className="h-4 w-4" />
              Contact Us
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tighter mb-6">
              Let's Start a <span className="text-myColorA">Conversation</span>
            </h1>
            <p className="text-xl text-white/70 font-medium max-w-2xl mx-auto leading-relaxed">
              Have a question, suggestion, or want to join our cause? We're here to listen and help you make an impact.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 px-6 md:px-12 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-16 items-start">

            {/* Left Column: Contact Info */}
            <div className="lg:col-span-2 space-y-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-6">Get in Touch</h2>
                <p className="text-lg text-slate-500 font-medium mb-10 leading-relaxed italic">
                  "{ourinfo.headline}"
                </p>

                <div className="space-y-6">
                  {[
                    { icon: Phone, label: "Phone", value: ourinfo.phoneNumber, accent: "text-blue-500", bg: "bg-blue-50" },
                    { icon: Mail, label: "Email", value: ourinfo.email, accent: "text-emerald-500", bg: "bg-emerald-50" },
                    { icon: MapPin, label: "Office", value: ourinfo.address, accent: "text-rose-500", bg: "bg-rose-50" },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ x: 10 }}
                      className="flex items-center gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100 group transition-all"
                    >
                      <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center transition-colors", item.bg, item.accent)}>
                        <item.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                        <p className="text-lg font-bold text-slate-900 line-clamp-2">{item.value}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="pt-6 border-t border-slate-100"
              >
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-8">Follow Our Mission</h3>
                <div className="flex gap-4">
                  {socialLinks.map((social, i) => (
                    <a
                      key={i}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white transition-all duration-300 hover:-translate-y-2 hover:shadow-xl",
                        social.color
                      )}
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="absolute -inset-4 bg-gradient-to-br from-myColorA/20 to-secondary/20 blur-3xl opacity-30 rounded-[3rem]" />
                <div className="relative bg-white border border-slate-100 p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-black/5">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-8 flex items-center gap-3">
                    Send Us a Message
                    <div className="h-1.5 w-12 bg-myColorA rounded-full" />
                  </h2>

                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-8 p-6 bg-emerald-50 border border-emerald-100 rounded-3xl flex items-center gap-4 text-emerald-900"
                    >
                      <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                      <p className="font-bold">Message sent successfully! We'll get back to you shortly.</p>
                    </motion.div>
                  )}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-8 p-6 bg-rose-50 border border-rose-100 rounded-3xl flex items-center gap-4 text-rose-900"
                    >
                      <div className="h-10 w-10 rounded-full bg-rose-500 flex items-center justify-center text-white shrink-0">
                        <AlertCircle className="h-6 w-6" />
                      </div>
                      <p className="font-bold">{error}</p>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                        <Input
                          name="name"
                          placeholder="Your Name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="h-14 bg-slate-50 border-slate-100 rounded-2xl px-6 font-bold text-slate-900 focus-visible:ring-myColorA/50 focus-visible:border-myColorA transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                        <Input
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="h-14 bg-slate-50 border-slate-100 rounded-2xl px-6 font-bold text-slate-900 focus-visible:ring-myColorA/50 focus-visible:border-myColorA transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Message Type</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-myColorA/50 focus:border-myColorA transition-all"
                      >
                        <option value="Contact">General Inquiry</option>
                        <option value="Suggestion">Suggestion</option>
                        <option value="Feedback">Feedback</option>
                        <option value="Volunteer">Volunteer Interest</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Your Message</label>
                      <Textarea
                        name="message"
                        placeholder="How can we help your journey?"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        className="min-h-[180px] bg-slate-50 border-slate-100 rounded-3xl p-6 font-bold text-slate-900 focus-visible:ring-myColorA/50 focus-visible:border-myColorA transition-all leading-relaxed"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-16 bg-myColorA hover:bg-myColorAB text-white rounded-[1.5rem] shadow-xl shadow-myColorA/20 transition-all hover:scale-[1.02] active:scale-95 text-lg font-black uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="h-6 w-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          Send Message
                          <Send className="h-5 w-5" />
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

      {/* Quick Footer CTA */}
      <section className="py-24 bg-slate-50 flex justify-center px-6">
        <div className="max-w-5xl w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter mb-8">
              Want to Join our Community?
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Button asChild size="lg" className="h-16 px-10 rounded-2xl font-black text-lg bg-white border-2 border-slate-100 text-slate-900 hover:bg-slate-50 shadow-sm transition-all">
                <a href="/volunteer">Volunteer With Us <ArrowRight className="ml-2 h-5 w-5" /></a>
              </Button>
              <Button asChild size="lg" className="h-16 px-10 rounded-2xl font-black text-lg bg-myColorA text-white hover:bg-myColorAB shadow-xl shadow-myColorA/20 transition-all">
                <a href="/donate">Support our Cause</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
