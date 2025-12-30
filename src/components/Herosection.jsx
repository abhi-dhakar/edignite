"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ArrowRight, Heart, Sparkles, MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
    subtitle: "Sustainable Change Together",
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
    <section className="relative h-[85vh] md:h-[90vh] w-full overflow-hidden bg-black">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full h-full"
      >
        <CarouselContent className="ml-0 h-full">
          {heroSlides.map((slide, index) => (
            <CarouselItem key={index} className="pl-0 relative w-full h-[85vh] md:h-[90vh]">
              {/* Background with advanced overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] ease-linear scale-110 active:scale-100"
                style={{
                  backgroundImage: `url(${slide.image})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
              </div>

              {/* Text Content */}
              <div className="relative h-full container mx-auto px-6 md:px-12 flex flex-col justify-center">
                <div className="max-w-3xl">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex items-center gap-2 mb-4"
                  >
                    <span className="h-[2px] w-12 bg-myColorA rounded-full" />
                    <span className="text-sm md:text-base font-black uppercase tracking-[0.4em] text-myColorA drop-shadow-md">
                      Official NGO Dashboard
                    </span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tighter mb-4"
                  >
                    {slide.title}
                    <br />
                    <span className={cn("bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent", slide.accent)}>
                      {slide.subtitle}
                    </span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-lg md:text-2xl text-white/80 mb-10 max-w-xl font-medium leading-relaxed"
                  >
                    {slide.description}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <Button
                      onClick={() => router.push(slide.buttonLink)}
                      className="h-14 md:h-16 px-8 md:px-10 bg-myColorA hover:bg-myColorAB text-white rounded-2xl text-lg font-black shadow-2xl shadow-myColorA/30 transition-all hover:scale-105 active:scale-95 group"
                    >
                      {slide.buttonText}
                      <MoveRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-2" />
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => router.push("/about")}
                      className="h-14 md:h-16 px-8 md:px-10 border-2 border-white/20 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 rounded-2xl text-lg font-black transition-all"
                    >
                      Explore Our Work
                    </Button>
                  </motion.div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Custom Navigation */}
        <div className="absolute bottom-12 left-6 md:left-12 flex items-center gap-6">
          <div className="flex gap-2">
            {heroSlides.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-700 ease-out",
                  activeIndex === i ? "w-10 bg-myColorA shadow-[0_0_15px_rgba(var(--myColorA-rgb),0.5)]" : "w-1.5 bg-white/30"
                )}
              />
            ))}
          </div>
        </div>

        <div className="absolute bottom-12 right-6 md:right-12 flex gap-4">
          <CarouselPrevious className="static h-12 w-12 translate-y-0 bg-white/5 hover:bg-white/20 border-white/10 text-white rounded-xl backdrop-blur-md" />
          <CarouselNext className="static h-12 w-12 translate-y-0 bg-white/5 hover:bg-white/20 border-white/10 text-white rounded-xl backdrop-blur-md" />
        </div>
      </Carousel>

      {/* Floating Statistics - Optional premium touch */}
      <div className="hidden lg:flex absolute bottom-0 right-0 p-12 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl flex gap-12"
        >
          <div className="text-center">
            <p className="text-3xl font-black text-white">25K+</p>
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Lives Impacted</p>
          </div>
          <div className="w-[1px] bg-white/10" />
          <div className="text-center">
            <p className="text-3xl font-black text-white">50+</p>
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Active Projects</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
