'use client'

import React from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  BookOpen,
  HeartPulse,
  Leaf,
  Users,
  TrendingUp,
  Globe,
  ArrowRight,
  ShieldCheck,
  Zap,
  Award
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function OurWorkPage() {
  const router = useRouter();

  const initiatives = [
    {
      id: 'education',
      title: 'Rural Education Access',
      description: 'Bringing quality education and digital literacy to underserved rural communities.',
      image: '/hero/education.png',
      icon: <BookOpen className="w-6 h-6 text-myColorA" />,
      progress: 75,
      impact: '5,000+ Students',
      color: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      id: 'healthcare',
      title: 'Community Healthcare',
      description: 'Mobile clinics and health awareness programs providing essential care to remote areas.',
      image: '/hero/healthcare.png',
      icon: <HeartPulse className="w-6 h-6 text-rose-500" />,
      progress: 60,
      impact: '30,000+ Beneficiaries',
      color: 'from-rose-500/20 to-orange-500/20'
    },
    {
      id: 'environment',
      title: 'Sustainable Empowerment',
      description: 'Empowering communities through sustainable practices and vocational training.',
      image: '/hero/empowerment.png',
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      progress: 85,
      impact: '200+ Communities',
      color: 'from-amber-500/20 to-yellow-500/20'
    }
  ];

  const workflowSteps = [
    {
      number: '01',
      title: 'Identify Needs',
      desc: 'Deep collaboration with locals to map critical gaps.',
      icon: <Users className="w-6 h-6" />
    },
    {
      number: '02',
      title: 'Co-Design',
      desc: 'Creating culturally relevant and scalable solutions.',
      icon: <Globe className="w-6 h-6" />
    },
    {
      number: '03',
      title: 'Build Capacity',
      desc: 'Training and resource allocation for self-reliance.',
      icon: <TrendingUp className="w-6 h-6" />
    },
    {
      number: '04',
      title: 'Sustainability',
      desc: 'Establishing long-term operational frameworks.',
      icon: <ShieldCheck className="w-6 h-6" />
    }
  ];

  const stats = [
    { label: 'Projects Completed', value: '50+', icon: <Award className="w-5 h-5" /> },
    { label: 'Families Assisted', value: '10k+', icon: <HeartPulse className="w-5 h-5" /> },
    { label: 'Rural Centers', value: '25+', icon: <Globe className="w-5 h-5" /> },
    { label: 'Active Volunteers', value: '500+', icon: <Users className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-myColorA/30">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-myColorA/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-4 overflow-hidden">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-block px-4 py-1.5 mb-6 rounded-full bg-myColorA/10 border border-myColorA/20 text-myColorAB text-sm font-semibold tracking-wide uppercase"
          >
            Making a difference every day
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight text-slate-900"
          >
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-myColorA via-myColorAB to-blue-800">Vision</span> in Action
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
          >
            We're building a future where every community has the resources,
            knowledge, and support to thrive independently and sustainably.
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 md:py-12 px-4">
        <div className="container mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8"
          >
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="group p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-myColorA/30 hover:bg-white hover:shadow-xl hover:shadow-myColorA/10 transition-all duration-300 text-center relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-myColorA scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
                <div className="flex justify-center mb-4 text-myColorA group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Initiatives Showcase */}
      <section className="py-24 px-4 bg-slate-50/50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Core Initiatives</h2>
              <p className="text-slate-600 text-lg">Measurable impact through focused programs in education, healthcare, and community empowerment.</p>
            </div>
            <Button
              variant="outline"
              className="group border-myColorA text-myColorA hover:bg-myColorA hover:text-white rounded-full px-8 h-12"
              onClick={() => router.push('/stories')}
            >
              Read Success Stories
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {initiatives.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                viewport={{ once: true }}
                className="group flex flex-col h-full bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="absolute top-4 left-4 p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-white shadow-xl shadow-black/5">
                    {item.icon}
                  </div>
                </div>

                <div className="p-8 flex-grow flex flex-col">
                  <div className="text-xs font-bold text-myColorA uppercase tracking-[0.2em] mb-3">{item.impact}</div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
                  <p className="text-slate-600 mb-8 leading-relaxed flex-grow">
                    {item.description}
                  </p>

                  <div className="mt-auto space-y-4">
                    <div className="flex items-center justify-between text-sm font-bold">
                      <span className="text-slate-500 uppercase tracking-widest">Efficiency</span>
                      <span className="text-myColorAB">{item.progress}%</span>
                    </div>
                    <Progress value={item.progress} className="h-2 bg-slate-100" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">How We Drive Change</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">A systematic, multi-phase approach to ensuring every initiative is impactful and self-sustaining.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 relative">
            {/* Connection Line (Desktop) */}
            <div className="hidden lg:block absolute top-[40px] left-0 w-full h-[2px] bg-slate-100 -z-10" />

            {workflowSteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="relative group pt-20 md:pt-24 flex flex-col items-center md:items-start text-center md:text-left"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 w-16 h-16 rounded-3xl bg-white border-2 border-slate-200 flex items-center justify-center text-myColorA group-hover:border-myColorA group-hover:bg-myColorA group-hover:text-white transition-all duration-300 shadow-xl shadow-slate-200/50">
                  <span className="absolute -top-3 -right-3 text-xs font-black px-2 py-1 bg-slate-900 text-white rounded-lg">
                    {step.number}
                  </span>
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-950 mb-3">{step.title}</h3>
                <p className="text-slate-700 leading-relaxed text-sm font-medium">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA */}
      <section className="py-24 px-4 overflow-hidden">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-slate-900 rounded-[3rem] p-8 md:p-16 text-center text-white overflow-hidden shadow-2xl shadow-myColorA/20"
          >
            {/* Animated Background Elements */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-myColorA/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-blue-600/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                Be the Catalyst for <br className="hidden md:block" /> Real-World <span className="text-myColorA">Transition.</span>
              </h2>
              <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
                Join our mission today. Whether through donation, volunteering, or partnership, your contribution directly fuels our transformation efforts.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                <Button
                  onClick={() => router.push("/donate")}
                  size="xl"
                  className="w-full sm:w-auto bg-myColorA hover:bg-myColorAB text-white rounded-full px-12 h-14 md:h-16 text-lg font-bold shadow-xl shadow-myColorA/30 group"
                >
                  Make a Donation
                  <HeartPulse className="ml-2 w-5 h-5 group-hover:scale-125 transition-transform" />
                </Button>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <Button
                    onClick={() => router.push("/volunteer")}
                    size="xl"
                    className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 rounded-full px-10 h-14 md:h-16 font-bold backdrop-blur-md transition-all hover:border-white/60"
                  >
                    Volunteer
                  </Button>
                  <Button
                    onClick={() => router.push("/contact")}
                    size="xl"
                    className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 rounded-full px-10 h-14 md:h-16 font-bold backdrop-blur-md transition-all hover:border-white/60"
                  >
                    Partner
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final Footer Decor */}
      <div className="py-8 text-center border-t border-slate-100 bg-slate-50/30">
        <p className="text-slate-400 text-sm font-medium tracking-widest uppercase">
          Edignite Foundation — Empowerment in every action
        </p>
      </div>
    </div>
  );
}
