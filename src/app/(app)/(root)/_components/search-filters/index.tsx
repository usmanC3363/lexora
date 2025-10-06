"use client";
import React from "react";
import { SearchInput } from "./search-input";
import { Categories } from "./categories";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import BreadcrumbNav from "./breadcrumb-nav";

export const SearchFilters = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());
  const params = useParams();

  const categoryParam = params.category as string | undefined;
  const activeCategory = categoryParam || "all";

  const activeCategoryData = data.find(
    (category) => category.slug === activeCategory,
  );

  const activeCategoryColor = activeCategoryData?.color || "#F5F5F5";
  const activeCategoryName = activeCategoryData?.name || "#F5F5F5";

  const activeSubCategory = (params.subcategory as string) || undefined;
  const activeSubCategoryName =
    activeCategoryData?.subcategories.find(
      (subcategory) => subcategory.slug === activeSubCategory,
    )?.name || null;

  return (
    <div
      className="flex w-full flex-col border-b px-4 pt-8 lg:px-12"
      style={{ backgroundColor: activeCategoryColor }}
    >
      <SearchInput />
      <div className="hidden lg:block">
        <Categories data={data} />
      </div>
      <BreadcrumbNav
        activeCategory={activeCategory}
        activeCategoryName={activeCategoryName}
        activeSubCategoryName={activeSubCategoryName}
      />
    </div>
  );
};

export const SearchFiltersSkeleton = () => {
  return (
    <div
      className="flex w-full flex-col gap-4 border-b px-4 py-8 lg:px-12"
      style={{ backgroundColor: "#F5F5F5" }}
    >
      <SearchInput disabled />
      <div className="hidden lg:block">
        <div className="h-11" />
      </div>
    </div>
  );
};
