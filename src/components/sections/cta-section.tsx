import { ArrowRight } from "lucide-react";

import Link from "next/link";

import { Button } from "../ui/button";

export default function CtaSection() {
  return (
    <section className="py-20 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
    <div className="container mx-auto px-4 relative">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <h2 className="text-3xl md:text-4xl font-bold">
          Ready to Dive In?
        </h2>
        <p className="text-xl text-muted-foreground">
          Explore our collection of articles and find your next favorite read.
        </p>
        <div className="flex justify-center">
          <Link href="/blog">
            <Button size="lg" className="w-full sm:w-auto">
              Start Reading
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </section>
  );
}