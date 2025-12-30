"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Globe,
  Target,
  Award,
  Heart,
  Sparkles,
  History,
  ShieldCheck,
  Milestone
} from "lucide-react";
import FAQ from "@/components/FAQ";
import CallToAction from "@/components/CallToAction";
import WhereWeWorks from "@/components/WhereWeWorks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const teamMembers = [
  {
    name: "Sarah Johnson",
    role: "Executive Director",
    desc: "15+ years in nonprofit leadership, Sarah brings vision and passion to our mission.",
    image: "https://i.pravatar.cc/300?img=47"
  },
  {
    name: "Michael Chen",
    role: "Operations Director",
    desc: "Michael oversees program implementation and ensures efficiency across operations.",
    image: "https://i.pravatar.cc/300?img=12"
  },
  {
    name: "Amara Okafor",
    role: "Community Outreach Lead",
    desc: "Amara builds and nurtures our partnerships with communities and stakeholders.",
    image: "https://i.pravatar.cc/300?img=26"
  }
];

const partners = [
  { name: "Global Impact Fund", logo: Award },
  { name: "Nature Trust", logo: Globe },
  { name: "Education First", logo: ShieldCheck },
  { name: "Unity Collective", logo: Milestone },
];

export default function AboutUsPage() {
  return (
    <div className="bg-white overflow-hidden">

      {/* Immersive Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-white" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-myColorA/20 via-transparent to-transparent opacity-50" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-black uppercase tracking-[0.3em] mb-8">
              <Sparkles className="h-4 w-4" />
              Our Legacy of Impact
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight tracking-tighter mb-8">
              Building a <span className="text-myColorA">Brighter Future</span> <br className="hidden md:block" />
              For Everyone
            </h1>
            <p className="text-xl md:text-2xl text-white/70 font-medium max-w-3xl mx-auto leading-relaxed">
              Founded in 2019 by NIT Surat students, we're dedicated to empowering the next generation through education, care, and collective action.
            </p>
          </motion.div>
        </div>

        {/* Animated scroll down indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 h-10 w-6 border-2 border-white/20 rounded-full flex justify-center p-1"
        >
          <div className="h-2 w-1 bg-myColorA rounded-full" />
        </motion.div>
      </section>

      {/* Our Story Section - Premium Redesign */}
      <section className="py-24 px-6 md:px-12 bg-white flex justify-center">
        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 rounded-2xl bg-myColorA/10 flex items-center justify-center text-myColorA">
                <History className="h-8 w-8" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">Our Story</h2>
            </div>
            <div className="space-y-6 text-lg text-slate-600 font-medium leading-relaxed">
              <p>
                What started as a dream among students at <span className="text-myColorA font-bold">NIT Surat</span> has blossomed into a movement of hope. Driven by the mission of Dr. A.P.J. Abdul Kalam, we set out to build an educated and empowered India.
              </p>
              <p>
                We focus on children who have never seen the inside of a classroom, those who cannot afford survival, and those seeking guidance for their dreams. We believe every child is a future leader waiting to be ignited.
              </p>
              <p className="p-6 bg-slate-50 rounded-3xl border-l-4 border-myColorA italic text-slate-900 shadow-xl shadow-black/5">
                "Till now, we have guided 350+ underprivileged kids, witnessing them succeed in scholarships and competitive exams. We are a registered Trust affiliated with NGO Darpan and the Govt. of India."
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-br from-myColorA/20 to-secondary/20 blur-3xl rounded-full" />
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl shadow-myColorA/30 aspect-[4/5] md:aspect-auto">
              {/* Using the generated high-quality image */}
              <img
                src="/about/mission-in-action.png"
                alt="Our Mission in Action"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <p className="text-xs font-black uppercase tracking-widest mb-1">Impact Spotlight</p>
                <p className="text-xl font-bold italic line-clamp-2">"Teaching is not just a job; it's the art of shaping the future."</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision - Glassmorphism Cards */}
      <section className="py-24 px-6 md:px-12 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6">Our Core Values</h2>
            <div className="h-1.5 w-24 bg-myColorA mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {[
              {
                title: "Our Mission",
                desc: "To empower communities through sustainable development, environmental conservation, and educational initiatives that create lasting positive change.",
                icon: Target,
                accent: "from-myColorA to-myColorAB"
              },
              {
                title: "Our Vision",
                desc: "A world where every person has the opportunity to reach their full potential, thriving in harmony with nature and shared resources.",
                icon: Globe,
                accent: "from-secondary to-myColorA"
              }
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="group relative h-full"
              >
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-[2.5rem] blur-2xl", card.accent)} />
                <div className="relative h-full bg-white border border-slate-100 p-10 md:p-14 rounded-[2.5rem] shadow-xl shadow-black/5 group-hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className={cn("h-16 w-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white mb-8 shadow-lg", card.accent)}>
                    <card.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">{card.title}</h3>
                  <p className="text-lg text-slate-500 font-medium leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team - Dynamic Profiles */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-6">The Minds Behind <br />The Mission</h2>
              <p className="text-xl text-slate-500 font-medium italic">"Dedicated leaders committed to driving transparency and impactful change every single day."</p>
            </div>
            <Button variant="outline" className="h-14 px-8 rounded-2xl font-black border-2 border-slate-100 hover:bg-slate-50 transition-all">
              Join Our Team
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {teamMembers.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group flex flex-col items-center text-center"
              >
                <div className="relative mb-8">
                  <div className="absolute inset-[-10px] bg-gradient-to-br from-myColorA to-secondary rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl scale-110" />
                  <div className="relative h-44 w-44 md:h-52 md:w-52 rounded-full p-2 bg-white ring-8 ring-slate-50 shadow-2xl shadow-myColorA/10 overflow-hidden transform group-hover:scale-[1.02] transition-all duration-500">
                    <img src={member.image} alt={member.name} className="h-full w-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-700" />
                  </div>
                  <div className="absolute -bottom-2 right-4 h-12 w-12 rounded-2xl bg-myColorA flex items-center justify-center text-white shadow-xl transform scale-0 group-hover:scale-100 transition-transform duration-500">
                    <Heart className="h-5 w-5 fill-current" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 group-hover:text-myColorA transition-colors mb-1">{member.name}</h3>
                <p className="text-sm font-black text-myColorA uppercase tracking-[0.2em] mb-4">{member.role}</p>
                <p className="text-slate-500 font-medium leading-relaxed max-w-xs">{member.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <WhereWeWorks />
      <FAQ />

      {/* Partners & Supporters - Minimalist Grid */}
      <section className="py-24 px-6 md:px-12 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase tracking-[0.2em] opacity-40">Trusted Partners</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {partners.map((partner, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center justify-center p-10 bg-white rounded-[2.5rem] shadow-lg shadow-black/5 hover:shadow-xl transition-all border border-slate-100 group"
              >
                <div className="h-16 w-16 mb-4 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-myColorA group-hover:bg-myColorA/5 transition-all transition-all duration-500">
                  <partner.logo size={40} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">
                  {partner.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CallToAction />
    </div>
  );
}
