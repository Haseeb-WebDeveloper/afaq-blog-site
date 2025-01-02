'use client';

import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
}

export default function SearchBar({ className }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }

    // Reset page when searching
    params.delete('page');

    startTransition(() => {
      router.push(`/blog?${params.toString()}`);
    });
  };

  return (
    <Input 
      placeholder="Search posts..." 
      type="search"
      defaultValue={searchParams.get('q') ?? ''}
      onChange={(e) => handleSearch(e.target.value)}
      className={cn(
        'w-full',
        isPending && 'opacity-50',
        className
      )}
    />
  );
} 