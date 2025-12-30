"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Heart, ArrowRight, Sparkles, Send } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="py-24 px-6 md:px-12 bg-white flex justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-6xl rounded-[3rem] bg-gradient-to-br from-myColorA via-myColorAB to-gray-900 p-12 md:p-20 flex flex-col items-center text-center shadow-2xl shadow-myColorA/30"
      >
        {/* Abstract background blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-sm font-black uppercase tracking-[0.3em] mb-8"
          >
            <Sparkles className="h-4 w-4" />
            Join the Movement
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tighter mb-8 max-w-4xl"
          >
            Your Compassion <br />
            <span className="text-secondary drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">Can Change History</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-white/80 font-medium mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            "Every act of kindness, no matter how small, sends a ripple of hope that can transform entire communities. Together, we are unstoppable."
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-6 justify-center w-full"
          >
            <Link href="/donate">
              <Button className="h-16 px-12 bg-white text-myColorAB hover:bg-gray-100 rounded-2xl text-xl font-black shadow-2xl transition-all hover:scale-105 active:scale-95 group">
                <Heart className="mr-3 h-6 w-6 text-red-500 fill-current group-hover:animate-pulse" />
                Make a Donation
              </Button>
            </Link>

            <Link href="/volunteer">
              <Button variant="outline" className="h-16 px-12 border-2 border-white/30 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 rounded-2xl text-xl font-black transition-all hover:scale-105">
                Join as Volunteer
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 flex flex-col items-center gap-4"
          >
            <div className="flex -space-x-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 w-12 rounded-full border-4 border-myColorA bg-gray-200 overflow-hidden shadow-lg">
                  <img src={`https://i.pravatar.cc/150?img=${i + 10}`} alt="Supporter" className="h-full w-full object-cover" />
                </div>
              ))}
              <div className="h-12 w-12 rounded-full border-4 border-myColorA bg-secondary flex items-center justify-center text-white font-black text-xs shadow-lg">
                +2k
              </div>
            </div>
            <p className="text-white/60 text-sm font-bold uppercase tracking-widest">Help us reach our year-end goal</p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default CallToAction;