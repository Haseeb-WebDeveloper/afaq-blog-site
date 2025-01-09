import { Metadata } from 'next';
import { siteConfig } from '@/config/seo';
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import FeaturedPosts from "@/components/sections/featured-posts";
import Testimonials from "@/components/sections/testimonials";
import HeroSection from "@/components/sections/hero-section";
import CtaSection from "@/components/sections/cta-section";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: "Haseeb Ahmed Raza Khan" }],
  creator: "Haseeb Ahmed Raza Khan",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@haseebahmedkhan"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }
  },
  alternates: {
    canonical: siteConfig.url
  }
};

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
