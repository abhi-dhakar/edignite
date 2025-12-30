"use client";

import React, { useEffect, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { useRef } from "react";
import { Users, Heart, Globe, Briefcase, Award, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const impactMetrics = [
  {
    label: "Communities Served",
    value: 20,
    suffix: "+",
    icon: Globe,
    color: "bg-blue-50 text-blue-600",
    description: "Reaching remote corners of the nation."
  },
  {
    label: "Lives Impacted",
    value: 2500,
    suffix: "+",
    icon: Users,
    color: "bg-emerald-50 text-emerald-600",
    description: "Meaningful change in individual lives."
  },
  {
    label: "Projects Completed",
    value: 50,
    suffix: "+",
    icon: Briefcase,
    color: "bg-amber-50 text-amber-600",
    description: "Delivering results where it matters."
  },
  {
    label: "States Reached",
    value: 10,
    suffix: "+",
    icon: Award,
    color: "bg-purple-50 text-purple-600",
    description: "Expanding our footprint across India."
  },
];

const Counter = ({ value, suffix }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      const node = ref.current;
      const controls = animate(0, value, {
        duration: 2,
        onUpdate(value) {
          node.textContent = Math.round(value).toLocaleString();
        },
      });
      return () => controls.stop();
    }
  }, [inView, value]);

  return <span ref={ref}>0</span>;
};

const OurImpacts = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none text-myColorA">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-myColorA/10 text-myColorA text-sm font-black uppercase tracking-widest mb-6"
          >
            <TrendingUp className="h-4 w-4" />
            Our Real-World Impact
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight tracking-tighter"
          >
            Numbers That Tell <br />
            <span className="text-myColorA">Our Success Story</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg md:text-xl text-gray-500 font-medium italic"
          >
            "Through dedicated efforts and strategic community partnerships, we've achieved results that transcend statistics."
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {impactMetrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-myColorA/10 transition-all group"
            >
              <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:rotate-12", metric.color)}>
                <metric.icon className="h-8 w-8" />
              </div>

              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-black text-gray-900 tracking-tighter">
                  <Counter value={metric.value} />
                </span>
                <span className="text-3xl font-black text-myColorA">{metric.suffix}</span>
              </div>

              <h3 className="text-lg font-black text-gray-800 mb-2">{metric.label}</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">{metric.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA or subtle note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 flex justify-center"
        >
          <div className="p-1 rounded-full bg-gray-50 border border-gray-100 flex items-center gap-3 pr-6">
            <div className="h-10 w-10 rounded-full bg-myColorA flex items-center justify-center text-white">
              <Heart className="h-5 w-5 fill-current" />
            </div>
            <p className="text-sm font-bold text-gray-600">Join 2,500+ supporters in making a difference today.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OurImpacts;