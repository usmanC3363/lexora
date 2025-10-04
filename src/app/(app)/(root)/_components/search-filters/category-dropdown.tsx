"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Category } from "@/payload-types";
import { useDropdownRef } from "./use-dropdown-postion";
import { SubcategoryMenu } from "./subcategory-menu";

interface Props {
  category: Category;
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

  const { getDropdownPosition } = useDropdownRef(dropdownRef);

  // ✅ Extract docs safely
  const subcategories = (
    category.subcategory &&
    "docs" in category.subcategory &&
    Array.isArray(category.subcategory.docs)
      ? category.subcategory.docs
      : []
  ) as Category[];

  const hasSubcategories = category.subcategory && subcategories.length > 0;

  const dropdownPosition = getDropdownPosition();

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
          {category.name}
        </Button>

        {hasSubcategories && (
          // the arrow type icon
          <>
            <div
              className={cn(
                "absolute -bottom-3.5 left-1/2 h-0 w-0 -translate-x-1/2 -scale-y-0 border-r-[10px] border-b-[10px] border-l-[10px] border-r-transparent border-b-black border-l-transparent transition-all duration-200",
                isOpen && "scale-y-100",
              )}
              // className="absolute top-full left-4 mt-6 h-fit w-screen max-w-full translate-x-[2px] translate-y-[2px] p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300"
            />
            <SubcategoryMenu
              category={category}
              isOpen={isOpen}
              position={dropdownPosition}
            />
          </>
        )}
      </div>
    </div>
  );
};
