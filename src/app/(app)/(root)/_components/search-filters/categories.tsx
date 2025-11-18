"use client";
import React, { useEffect, useRef, useState } from "react";
import { CategoryDropdown } from "./category-dropdown";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ListFilterIcon } from "lucide-react";
import { CategoriesSidebar } from "./categories-sidebar";
import { CategoriesGetManyOutput } from "@/modules/categories/types";
import { useParams } from "next/navigation";

type Props = { data: CategoriesGetManyOutput };

export const Categories = ({ data }: Props) => {
  const params = useParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const viewAllRef = useRef<HTMLDivElement>(null);

  const [visibleCount, setVisibleCount] = useState(data.length);
  const [isAnyHovered, setIsAnyHovered] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const categoryParam = params.category as string | undefined;
  const activeCategory = categoryParam || "all";

  const activeCategoryIndex = data.findIndex(
    (cat: CategoriesGetManyOutput[1]) => cat.slug === activeCategory,
  );
  const isActiveCategoryHidden =
    activeCategoryIndex > visibleCount && activeCategoryIndex !== -1;

  useEffect(() => {
    const calculateVisible = () => {
      if (!containerRef.current || !measureRef.current || !viewAllRef.current)
        return;

      const containerWidth = containerRef.current.offsetWidth;
      const viewAllWidth = viewAllRef.current.offsetWidth;
      const availableWidth = containerWidth - viewAllWidth;

      const items = Array.from(measureRef.current.children);
      let totalWidth = 0;
      let visible = 0;

      for (const item of items) {
        const width = item.getBoundingClientRect().width;
        if (totalWidth + width > availableWidth) break;
        totalWidth += width;
        visible++;
      }

      setVisibleCount(visible);
    };

    const resizeObserver = new ResizeObserver(calculateVisible);
    resizeObserver.observe(containerRef.current!);

    return () => resizeObserver.disconnect();
  }, [data.length]);

  return (
    <div className="relative">
      <CategoriesSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />

      {/* Hidden categories for Ref measurement */}
      <div
        className="pointer-events-none absolute flex h-full opacity-0"
        style={{ position: "fixed", top: -9999, left: -9999 }}
        ref={measureRef}
      >
        {data.map((category: CategoriesGetManyOutput[1]) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category}
              isActive={activeCategory === category.slug}
              isNavigationHovered={false}
            />
          </div>
        ))}
      </div>
      {/* Actual visible categories */}
      <div
        className="no-scrollbar relative z-100 min-h-18 w-screen"
        ref={containerRef}
      >
        <div
          className="absolute -bottom-1 left-0 flex min-h-16 flex-nowrap gap-4 pr-18"
          onMouseEnter={() => setIsAnyHovered(true)}
          onMouseLeave={() => setIsAnyHovered(false)}
        >
          {data
            .slice(0, visibleCount)
            .map((category: CategoriesGetManyOutput[1]) => (
              <div key={category.id}>
                <CategoryDropdown
                  category={category}
                  isActive={activeCategory === category.slug}
                  isNavigationHovered={isAnyHovered}
                />
              </div>
            ))}

          <div ref={viewAllRef} className="shrink-0">
            <Button
              variant="ogelevated"
              className={cn(
                "hover:border-primary h-11 rounded-full border-transparent bg-transparent px-4 text-black hover:bg-white",
                isActiveCategoryHidden &&
                  !isAnyHovered &&
                  "border-primary bg-white",
              )}
              onClick={() => setIsSidebarOpen(true)}
            >
              View All
              <ListFilterIcon className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
