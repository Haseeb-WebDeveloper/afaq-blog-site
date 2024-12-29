import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import HeroSection from "@/components/sections/hero-section";
import FeaturedPosts from "@/components/sections/featured-posts";
import Testimonials from "@/components/sections/testimonials";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedPosts />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
