"use client";

import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ArrowRight, Heart, Sparkles, MoveRight, ChevronDown, Users, Globe, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { SparklesCore } from "./ui/sparkles";

const heroSlides = [
  {
    title: "Empowering Lives",
    subtitle: "Through Education & Hope",
    description:
      "Every child deserves a chance to shine. Join us in providing quality education and life-altering resources to those who need it most.",
    image: "/hero/education.png",
    buttonText: "Join Our Mission",
    buttonLink: "/donate",
    accent: "text-blue-400",
  },
  {
    title: "Healing Communities",
    subtitle: "Care Without Boundaries",
    description:
      "Bringing essential healthcare and medical services to the heart of rural India, ensuring no one is left behind in their time of need.",
    image: "/hero/healthcare.png",
    buttonText: "Support Healthcare",
    buttonLink: "/donate",
    accent: "text-emerald-400",
  },
  {
    title: "Building Futures",
    subtitle: "Where Hope Meets Action",
    description:
      "From planting seeds of hope to building community hubs, we're creating lasting impact through collective volunteer action.",
    image: "/hero/empowerment.png",
    buttonText: "Become a Volunteer",
    buttonLink: "/volunteer",
    accent: "text-amber-400",
  },
];

export default function HeroSection() {
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: false }));
  const router = useRouter();
  const [api, setApi] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Mouse Parallax Effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const dx = useSpring(mouseX, springConfig);
  const dy = useSpring(mouseY, springConfig);

  const translateBackgroundX = useTransform(dx, [-500, 500], [-20, 20]);
  const translateBackgroundY = useTransform(dy, [-500, 500], [-20, 20]);

  const handleMouseMove = useCallback((e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = clientX - innerWidth / 2;
    const y = clientY - innerHeight / 2;
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setActiveIndex(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  return (
    <section className="relative h-[calc(90vh-56px)] md:h-[calc(100vh-64px)] w-full overflow-hidden bg-black group/section">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full h-full"
      >
        <CarouselContent className="ml-0 h-full">
          {heroSlides.map((slide, index) => (
            <CarouselItem key={index} className="pl-0 relative w-full basis-full overflow-hidden h-[calc(90vh-56px)] md:h-[calc(100vh-64px)]">
              {/* Background with advanced overlay and parallax */}
              <motion.div
                className="absolute inset-x-[-10%] inset-y-[-10%] w-[120%] h-[120%] bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] ease-linear scale-110 active:scale-100"
                style={{
                  backgroundImage: `url(${slide.image})`,
                  x: translateBackgroundX,
                  y: translateBackgroundY,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

                {/* Particle Overlay */}
                <div className="absolute inset-0 opacity-30">
                  <SparklesCore
                    id={`sparkles-${index}`}
                    background="transparent"
                    minSize={0.4}
                    maxSize={1.5}
                    speed={1}
                    particleDensity={50}
                    className="w-full h-full"
                    particleColor="#ffffff"
                  />
                </div>
              </motion.div>

              {/* Text Content */}
              <div className="relative h-full container mx-auto px-6 md:px-12 flex flex-col justify-center pt-20 md:pt-24">
                <div className="max-w-4xl">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={activeIndex === index ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex items-center gap-3 mb-6"
                  >
                    <span className="h-[2px] w-12 bg-myColorA rounded-full shadow-[0_0_10px_rgba(var(--myColorA-rgb),0.5)]" />
                    <span className="text-xs md:text-sm font-black uppercase tracking-[0.6em] text-myColorA drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
                      Empowering Humanity
                    </span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={activeIndex === index ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-3xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tighter mb-4"
                  >
                    {slide.title}
                    <br />
                    <span className={cn("bg-gradient-to-r from-white via-white/80 to-transparent bg-clip-text text-transparent italic", slide.accent)}>
                      {slide.subtitle}
                    </span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={activeIndex === index ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-sm md:text-xl text-white/70 mb-8 max-w-xl font-medium leading-relaxed"
                  >
                    {slide.description}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={activeIndex === index ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <Button
                      onClick={() => router.push(slide.buttonLink)}
                      className="h-12 md:h-16 px-8 md:px-12 bg-myColorA hover:bg-myColorAB text-white rounded-full text-base md:text-lg font-black shadow-2xl shadow-myColorA/40 transition-all hover:scale-105 active:scale-95 group overflow-hidden relative"
                    >
                      <span className="relative z-10 flex items-center">
                        {slide.buttonText}
                        <MoveRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
                      </span>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => router.push("/about")}
                      className="h-12 md:h-16 px-8 md:px-12 border-2 border-white/10 bg-white/5 backdrop-blur-xl text-white hover:bg-white/10 rounded-full text-base md:text-lg font-black transition-all hover:border-white/40"
                    >
                      Explore Our Story
                    </Button>
                  </motion.div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>


        {/* Scroll Down Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-white/30"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </motion.div>

        {/* Custom Navigation */}
        <div className="absolute bottom-12 left-6 md:left-12 flex items-center gap-6">
          <div className="flex gap-3">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => api?.scrollTo(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-700 ease-out",
                  activeIndex === i ? "w-12 bg-myColorA shadow-[0_0_20px_rgba(var(--myColorA-rgb),0.8)]" : "w-2 bg-white/20 hover:bg-white/40"
                )}
              />
            ))}
          </div>
        </div>

        <div className="absolute bottom-12 right-6 md:right-12 hidden md:flex gap-4">
          <CarouselPrevious className="static h-14 w-14 translate-y-0 bg-white/5 hover:bg-white/20 border-white/10 text-white rounded-full backdrop-blur-md transition-all hover:scale-110" />
          <CarouselNext className="static h-14 w-14 translate-y-0 bg-white/5 hover:bg-white/20 border-white/10 text-white rounded-full backdrop-blur-md transition-all hover:scale-110" />
        </div>
      </Carousel>

      {/* Floating Statistics - Premium touch */}
      <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 right-6 lg:right-12 flex-col gap-6 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="bg-black/40 backdrop-blur-3xl border border-white/10 p-6 lg:p-8 rounded-[2rem] shadow-2xl flex flex-col gap-6 lg:gap-8 min-w-[200px] lg:min-w-[240px]"
        >
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-myColorA/20 flex items-center justify-center text-myColorA">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl lg:text-3xl font-black text-white">25K+</p>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mt-1">Lives Impacted</p>
            </div>
          </div>

          <div className="h-px bg-white/10" />

          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl lg:text-3xl font-black text-white">50+</p>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mt-1">Active Projects</p>
            </div>
          </div>

          <div className="h-px bg-white/10" />

          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl lg:text-3xl font-black text-white">10M+</p>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mt-1">Support Reached</p>
            </div>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
