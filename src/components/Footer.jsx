"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Heart,
  ArrowRight,
  Send,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";

const footerLinks = {
  quickLinks: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Our Programs", href: "/our-work" },
    { label: "Success Stories", href: "/success-stories" },
  ],
  resources: [
    { label: "Events", href: "/events" },
    { label: "Media Gallery", href: "/mediagallery" },
    { label: "Blogs", href: "/blogs" },
    { label: "FAQ", href: "/faq" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", color: "hover:text-blue-500" },
  { icon: Twitter, href: "#", color: "hover:text-sky-400" },
  { icon: Instagram, href: "#", color: "hover:text-pink-500" },
  { icon: Linkedin, href: "#", color: "hover:text-blue-600" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 relative overflow-hidden pt-24 pb-12">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-myColorA/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Column 1: Brand & Mission */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-12 w-12 rounded-xl bg-white shadow-xl flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                <img src="/images.png" alt="Edignite Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-2xl tracking-tighter text-white group-hover:text-myColorA transition-colors">
                  EDIGNITE
                </span>
                <span className="text-[10px] font-bold text-myColorA uppercase tracking-[0.3em] font-sans">
                  Hope for others
                </span>
              </div>
            </Link>
            <p className="text-slate-400 font-medium leading-relaxed max-w-sm italic">
              "We believe in the power of collective action to transform lives and protect our planet's future."
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social, i) => (
                <Link
                  key={i}
                  href={social.href}
                  className={`h-10 w-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 transition-all duration-300 ${social.color} hover:border-current hover:bg-slate-800 hover:-translate-y-1`}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:pl-8">
            <h3 className="text-white font-black uppercase tracking-widest text-sm mb-8 flex items-center gap-2">
              <span className="h-1 w-4 bg-myColorA rounded-full" />
              Quick Links
            </h3>
            <ul className="space-y-4">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-myColorA font-bold flex items-center group transition-colors"
                  >
                    <ArrowRight className="h-4 w-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="text-white font-black uppercase tracking-widest text-sm mb-8 flex items-center gap-2">
              <span className="h-1 w-4 bg-myColorA rounded-full" />
              Resources
            </h3>
            <ul className="space-y-4">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-myColorA font-bold flex items-center group transition-colors"
                  >
                    <ArrowRight className="h-4 w-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-8">
            <div>
              <h3 className="text-white font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                <span className="h-1 w-4 bg-myColorA rounded-full" />
                Newsletter
              </h3>
              <p className="text-sm text-slate-400 font-medium mb-6">
                Join our mission updates. We'll send hope to your inbox, not spam.
              </p>
              <div className="relative group">
                <Input
                  placeholder="Enter your email"
                  className="h-14 bg-slate-900 border-slate-800 text-white rounded-2xl pl-6 pr-14 focus-visible:ring-myColorA/50 focus-visible:border-myColorA transition-all"
                />
                <Button
                  size="icon"
                  className="absolute right-1 top-1 h-12 w-12 rounded-xl bg-myColorA hover:bg-myColorAB text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-900">
              <div className="flex items-center gap-3 text-sm font-bold text-slate-400 group cursor-pointer hover:text-white transition-colors">
                <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center text-myColorA border border-slate-800">
                  <Mail className="h-4 w-4" />
                </div>
                contact@edignite.org
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-slate-400 group cursor-pointer hover:text-white transition-colors">
                <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center text-myColorA border border-slate-800">
                  <Phone className="h-4 w-4" />
                </div>
                +91 1234 567 890
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-12 bg-slate-900" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            © 2025 Edignite NGO. Crafted with <Heart className="h-3 w-3 inline text-red-500 fill-current" /> for humanity.
          </p>
          <div className="flex gap-8">
            <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
