"use client";
import React from "react";
import { useProductFilters } from "../../hooks/use-product-filters";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const ProductSort = () => {
  const [filters, setFilters] = useProductFilters();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        className={cn(
          "rounded-full bg-white hover:bg-white",
          filters.sort !== "curated" &&
            "hover:border-border border-transparent bg-transparent hover:bg-transparent",
        )}
        onClick={() => setFilters({ sort: "curated" })}
      >
        Curated
      </Button>
      <Button
        variant="secondary"
        className={cn(
          "rounded-full bg-white hover:bg-white",
          filters.sort !== "trending" &&
            "hover:border-border border-transparent bg-transparent hover:bg-transparent",
        )}
        onClick={() => setFilters({ sort: "trending" })}
      >
        Trending
      </Button>
      <Button
        variant="secondary"
        className={cn(
          "rounded-full bg-white hover:bg-white",
          filters.sort !== "popular" &&
            "hover:border-border border-transparent bg-transparent hover:bg-transparent",
        )}
        onClick={() => setFilters({ sort: "popular" })}
      >
        Popular
      </Button>
    </div>
  );
};
