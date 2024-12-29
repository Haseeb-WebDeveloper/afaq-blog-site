import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black">
        <div className="absolute h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        {/* Blob effect */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 dark:bg-primary/10 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="flex flex-col items-center space-y-8 text-center max-w-3xl mx-auto">
          <div className="space-y-6">
            <div 
              className="inline-block rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-1 text-sm 
                         shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <span className="inline-flex items-center gap-x-1.5">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span>Welcome to My Blog</span>
              </span>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-500">
                Exploring Ideas &
              </span>
              <span className="block mt-2 text-primary animate-gradient bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text bg-300% font-extrabold">
                Sharing Knowledge
              </span>
            </h1>

            <p className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl leading-relaxed">
              Discover thought-provoking articles about technology, development, and digital innovation. 
              Join me on this journey of continuous learning and exploration.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link 
              href="/blog"
              className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
            >
              Explore Articles
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

        </div>
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
