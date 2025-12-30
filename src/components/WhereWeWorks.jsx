"use client";

import React from "react";
import { motion } from "framer-motion";
import { Globe, MapPin, Navigation, Anchor, Building2, Trees } from "lucide-react";
import { cn } from "@/lib/utils";

const operationalRegions = [
  {
    city: "Surat",
    desc: "Sustainable agriculture and clean water initiatives",
    icon: Trees,
    accent: "text-emerald-500",
    bg: "bg-emerald-50"
  },
  {
    city: "Rajasthan",
    desc: "Education and healthcare access programs",
    icon: Building2,
    accent: "text-blue-500",
    bg: "bg-blue-50"
  },
  {
    city: "Rajkot",
    desc: "Environmental conservation and community resilience",
    icon: Anchor,
    accent: "text-amber-500",
    bg: "bg-amber-50"
  },
  {
    city: "Mumbai",
    desc: "Urban renewal and food security initiatives",
    icon: Navigation,
    accent: "text-rose-500",
    bg: "bg-rose-50"
  }
];

const WhereWeWorks = () => {
  return (
    <section className="py-24 px-6 md:px-12 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 h-96 w-96 bg-myColorA/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="lg:grid lg:grid-cols-2 lg:gap-20 items-center">

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-6">
              <Globe className="h-4 w-4" />
              Global Reach, Local Impact
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-8 max-w-lg">
              Our Hands-on <span className="text-myColorA">Operational Presence</span>
            </h2>
            <p className="text-xl text-slate-500 font-medium leading-relaxed mb-12">
              We focus our energy where the need is greatest, building sustainable ecosystems that empower local communities across India.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {operationalRegions.map((region, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-black/5 transition-all group"
                >
                  <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center mb-4 transition-colors", region.bg, region.accent)}>
                    <region.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-2 group-hover:text-myColorA transition-colors">{region.city}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-snug">{region.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="mt-16 lg:mt-0 relative"
          >
            <div className="absolute inset-0 bg-myColorA/20 rounded-full blur-3xl opacity-20 animate-pulse" />
            <div className="relative aspect-square md:aspect-[4/3] rounded-[3rem] bg-slate-900 overflow-hidden shadow-2xl flex items-center justify-center group">
              {/* Abstract Map/Globe Visual */}
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
              <div className="relative z-10 flex flex-col items-center gap-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  className="h-32 w-32 md:h-48 md:w-48 rounded-full border-2 border-dashed border-myColorA/40 flex items-center justify-center"
                >
                  <Globe className="h-16 w-16 md:h-24 md:w-24 text-myColorA drop-shadow-[0_0_15px_rgba(var(--myColorA-rgb),0.5)]" />
                </motion.div>
                <div className="text-center">
                  <p className="text-2xl md:text-4xl font-black text-white tracking-tighter mb-2 italic">Impacting 15+ Regions</p>
                  <p className="text-sm font-bold text-myColorA uppercase tracking-[0.3em]">Excellence in Service</p>
                </div>
              </div>

              {/* Pulsing Pins */}
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute top-1/4 right-1/4 h-3 w-3 bg-myColorA rounded-full shadow-[0_0_10px_#22c55e]"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                className="absolute bottom-1/3 left-1/4 h-3 w-3 bg-secondary rounded-full shadow-[0_0_10px_#fbbf24]"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2, delay: 1 }}
                className="absolute top-1/2 left-1/2 h-2 w-2 bg-white rounded-full shadow-[0_0_10px_#fff]"
              />
            </div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-6 -right-6 md:right-12 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 flex items-center gap-4"
            >
              <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Base Operations</p>
                <p className="text-xl font-black text-slate-900 tracking-tight">Surat, Gujarat</p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default WhereWeWorks;