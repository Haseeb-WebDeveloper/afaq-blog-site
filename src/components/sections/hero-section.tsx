import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
          <div className="container mx-auto px-4 py-24 md:py-32 relative">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                Welcome to Our Blog
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
                Discover Stories & Insights
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Dive into a world of articles and stories that inspire, inform, and entertain.
              </p>

              <div className="flex justify-center">
                <Link href="/blog">
                  <Button size="lg" className="w-full sm:w-auto">
                    Explore Articles
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute inset-0 -z-10 h-full w-full">
            <div className="absolute h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
          </div>
        </section>
  );
}

// Add this to your globals.css
const styles = `
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-gradient {
  animation: gradient 6s ease-in-out infinite;
}

.bg-300\% {
  background-size: 300%;
}
`;
