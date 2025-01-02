'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface SortButtonsProps {
  currentSort?: string;
  searchParams: URLSearchParams;
}

export default function SortButtons({ currentSort, searchParams }: SortButtonsProps) {
  const router = useRouter();

  const handleSort = (sort?: string) => {
    const params = new URLSearchParams(searchParams);
    if (sort) {
      params.set('sort', sort);
    } else {
      params.delete('sort');
    }
    router.push(`/blog?${params.toString()}`);
  };

  return (
    <div className="flex gap-2">
      <Button
        variant={currentSort !== 'popular' ? "default" : "outline"}
        size="sm"
        onClick={() => handleSort()}
      >
        Latest
      </Button>
      <Button
        variant={currentSort === 'popular' ? "default" : "outline"}
        size="sm"
        onClick={() => handleSort('popular')}
      >
        Popular
      </Button>
    </div>
  );
} 