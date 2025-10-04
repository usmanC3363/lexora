"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import React, { useState } from "react";
import { CustomCategory } from "../../types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  data: CustomCategory[];
};

export const CategoriesSidebar = ({ open, onOpenChange, data }: Props) => {
  const router = useRouter();
  const [parentCategories, setParentCategories] = useState<
    CustomCategory[] | null
  >(null);
  const [selectedCategory, setSelectedCategory] =
    useState<CustomCategory | null>(null);

  const currentCategories = parentCategories ?? data ?? [];

  const handleOpenChange = (open: boolean) => {
    setSelectedCategory(null);
    setParentCategories(null);
    onOpenChange(open);
  };

  const handleCatClick = (category: CustomCategory) => {
    if (category.subcategories && category.subcategories.length > 0) {
      setParentCategories(category.subcategories as CustomCategory[]);
      setSelectedCategory(category);
    } else {
      // this is a leaf category, no children
      if (parentCategories && selectedCategory) {
        // route to subcategory of a parent
        router.push(`/${selectedCategory.slug}/${category.slug}`);
      } else {
        if (category.slug === "all") {
          router.push(`/`);
        } else {
          router.push(`/${category.slug}`);
        }
      }
      handleOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="left"
        className="w-80 p-0 transition-none"
        style={{ backgroundColor: selectedCategory?.color ?? "whitesmoke" }}
      >
        <SheetHeader className="border-b p-4">
          <SheetTitle>Categories</SheetTitle>
        </SheetHeader>
        <ScrollArea>
          {parentCategories && (
            <button
              className="group flex w-full items-center p-4 text-left text-base font-medium hover:bg-black hover:text-white"
              onClick={() => {
                if (parentCategories) {
                  setParentCategories(null);
                  setSelectedCategory(null);
                }
              }}
            >
              <ChevronLeftIcon className="mr-2 size-4 transition-all duration-100 ease-linear group-hover:size-6" />
              Back
            </button>
          )}
          {currentCategories.map((currentCat) => (
            <button
              key={currentCat.slug}
              onClick={() => handleCatClick(currentCat)}
              className="group flex w-full items-center justify-between p-4 text-left text-base font-medium transition-all duration-100 ease-linear hover:bg-black hover:text-lg hover:tracking-wide hover:text-white"
            >
              {currentCat.name}
              {currentCat.subcategories &&
                currentCat.subcategories.length > 0 && (
                  <ChevronRightIcon className="size-4 transition-all duration-100 ease-linear group-hover:size-6" />
                )}
            </button>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
