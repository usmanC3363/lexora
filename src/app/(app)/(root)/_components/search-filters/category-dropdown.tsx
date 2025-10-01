"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Category } from "@/payload-types";

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
  const [hovered, setHovered] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ Extract docs safely
  const subcategories = (
    category.subcategory &&
    "docs" in category.subcategory &&
    Array.isArray(category.subcategory.docs)
      ? category.subcategory.docs
      : []
  ) as Category[];

  const hasSubcategories = subcategories.length > 0;

  const shouldShowDropdown =
    (isActive || hovered || isNavigationHovered) && hasSubcategories;

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Button */}
      <Button
        variant="elevated"
        className={cn(
          "hover:border-primary h-11 rounded-full border-transparent bg-transparent px-4 text-black hover:bg-white",
          isActive && !isNavigationHovered && "border-primary bg-white",
        )}
      >
        {category.name}
      </Button>

      {/* Dropdown rectangle */}
      {shouldShowDropdown && (
        <div
          className="absolute top-full left-4 mt-6 h-fit w-screen max-w-full p-4 shadow-lg transition-all duration-300 md:h-64 lg:h-80"
          style={{
            backgroundColor: category.color ?? "#f5f5f5",
          }}
        >
          <div className="flex flex-col gap-2">
            {subcategories.map((sub) => (
              <div
                key={typeof sub === "string" ? sub : sub.id}
                className="font-medium text-white"
              >
                {typeof sub === "string" ? sub : sub.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
