"use client";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
// import { useTheme } from "next-themes";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
import { useRouter } from "next/navigation";

const heroSlides = [
  {
    title: "Empowering Lives",
    subtitle: "One Step at a Time",
    description:
      "Providing education, healthcare, and hope to underprivileged communities.",
    image: "/slider-1.jpeg",
    buttonText: "Donate Now",
    buttonLink: "/donate",
  },
  {
    title: "Education for All",
    subtitle: "Building Future Leaders",
    description:
      "Supporting children's education through scholarships and resources.",
    image: "shiksha.jpg",
    buttonText: "Support Education",
    buttonLink: "/donate",
  },
  {
    title: "Healthcare Access",
    subtitle: "For Every Community",
    description:
      "Bringing medical care and health awareness to remote villages.",
    image: "children-banner.webp",
    buttonText: "Join Our Cause",
    buttonLink: "/donate",
  },
];

export default function HeroSection() {
  //   const { theme } = useTheme();
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));
  const router = useRouter();

  return (
    <section className="relative  min-h-[60vh] w-full overflow-hidden">
      <Carousel
        plugins={[plugin.current]}
        className="w-full h-[60vh]"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {heroSlides.map((slide, index) => (
            <CarouselItem key={index} className="relative w-full h-[60vh]">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${slide.image})`,
                }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 dark:bg-black/60" />
              </div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative h-full flex flex-col items-center justify-center text-center px-4"
              >
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-4xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-myColorA to-myColorAB text-transparent bg-clip-text">
                    {slide.title}
                  </h2>

                  <h3 className="text-3xl md:text-5xl font-semibold mb-6 text-white">
                    {slide.subtitle}
                  </h3>

                  <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                    {slide.description}
                  </p>

                  <motion.button
                    onClick={() => router.push(slide.buttonLink)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gradient-to-r from-myColorA to-myColorAB rounded-full text-white text-lg font-semibold shadow-lg hover:shadow-cyan-500/25 transition-all"
                  >
                    {slide.buttonText}
                  </motion.button>
                </div>

                <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
                  {heroSlides.map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 rounded-full transition-all duration-400 ${
                        i === index ? "w-8 bg-myColorA" : "w-2 bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-4 bg-white/10 hover:bg-white/20 border-none text-white" />
        <CarouselNext className="right-4 bg-white/10 hover:bg-white/20 border-none text-white" />
      </Carousel>
    </section>
  );
}
