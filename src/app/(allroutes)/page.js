"use client";

import CallToAction from "@/components/CallToAction";
import FAQ from "@/components/FAQ";
import HeroSection from "@/components/Herosection";
import NewVolunteers from "@/components/NewVolunteers";
import OurImpacts from "@/components/ourImpacts";
import StoriesSection from "@/components/StoriesSection";

export default function HomePage() {
  return (
    <div className="min-h-screen">
     <HeroSection />
     <OurImpacts/>
     <StoriesSection/>
     <NewVolunteers/>
     <FAQ/>
     <CallToAction/>
    </div>
  );
}
