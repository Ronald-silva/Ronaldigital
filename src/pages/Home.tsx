import { SEO } from "@/components/SEO";
import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import ProcessSection from "@/components/sections/ProcessSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";

export default function Home() {
  return (
    <>
      <SEO canonical="/" />
      <HeroSection />
      <ServicesSection />
      <ProcessSection />
      <TestimonialsSection />
    </>
  );
}