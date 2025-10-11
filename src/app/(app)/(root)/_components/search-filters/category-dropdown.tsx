"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SubcategoryMenu } from "./subcategory-menu";
import Link from "next/link";
import { CategoriesGetManyOutput } from "@/modules/categories/types";

interface Props {
  category: CategoriesGetManyOutput[1];
  isActive?: boolean;
  isNavigationHovered?: boolean;
}

export const CategoryDropdown = ({
  category,
  isActive = false,
  isNavigationHovered = false,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="relative">
        {/* Button */}
        <Button
          asChild
          variant="elevated"
          className={cn(
            "hover:border-primary h-11 rounded-full border-transparent bg-transparent px-4 text-black hover:bg-white",
            isActive &&
              !isNavigationHovered &&
              "border-primary translate-x-[4px] translate-y-[4px] bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
            isOpen &&
              "border-primary translate-x-[4px] translate-y-[4px] bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
          )}
        >
          <Link href={`/${category.slug === "all" ? "" : category.slug}`}>
            {category.name}
          </Link>
        </Button>

        {category.subcategories && category.subcategories.length > 0 && (
          <div
            className={cn(
              "absolute -bottom-3.5 left-1/2 h-0 w-0 -translate-x-1/2 -scale-y-0 border-r-[10px] border-b-[10px] border-l-[10px] border-r-transparent border-b-black border-l-transparent transition-all duration-200",
              isOpen && "scale-y-100",
            )}
            // the arrow type icon
          />
        )}
      </div>
      <SubcategoryMenu category={category} isOpen={isOpen} />
    </div>
  );
};
