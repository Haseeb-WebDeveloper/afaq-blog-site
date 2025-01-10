'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ActiveFiltersProps {
  tag?: string;
  category?: string;
  q?: string;
}

export default function ActiveFilters({ tag, category, q }: ActiveFiltersProps) {
  const router = useRouter();

  if (!tag && !category && !q) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {q && (
        <Badge variant="secondary">
          Search: {q}
        </Badge>
      )}
      {category && (
        <Badge variant="secondary">
          Category: {category}
        </Badge>
      )}
      {tag && (
        <Badge variant="secondary">
          Tag: {tag}
        </Badge>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push('/blog')}
      >
        Clear all
      </Button>
    </div>
  );
} 