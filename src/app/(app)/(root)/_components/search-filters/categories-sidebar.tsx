"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { CategoriesGetManyOutput } from "@/modules/categories/types";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const CategoriesSidebar = ({ open, onOpenChange }: Props) => {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.categories.getMany.queryOptions());
  const router = useRouter();
  const [parentCategories, setParentCategories] =
    useState<CategoriesGetManyOutput | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<
    CategoriesGetManyOutput[1] | null
  >(null);

  const currentCategories = parentCategories ?? data ?? [];

  const handleOpenChange = (open: boolean) => {
    setSelectedCategory(null);
    setParentCategories(null);
    onOpenChange(open);
  };

  const handleCatClick = (category: CategoriesGetManyOutput[1]) => {
    if (category.subcategories && category.subcategories.length > 0) {
      setParentCategories(category.subcategories as CategoriesGetManyOutput);
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
