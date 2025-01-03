import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import FeaturedPosts from "@/components/sections/featured-posts";
import Testimonials from "@/components/sections/testimonials";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import HeroSection from "@/components/sections/hero-section";
import CtaSection from "@/components/sections/cta-section";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-dot-pattern">
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
       <HeroSection />

        {/* Featured Posts Section */}
        <FeaturedPosts />

        {/* Testimonials Section */}
        <Testimonials />
        {/* CTA Section */}
        <CtaSection />
      </main>

      <Footer />
    </div>
  );
}
