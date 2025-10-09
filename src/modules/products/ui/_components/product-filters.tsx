"use client";

import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronRightIcon, Icon } from "lucide-react";
import React, { useState } from "react";
import { PriceFilter } from "./price-filter";
import { useProductFilters } from "../../hooks/use-product-filters";
import { TagsFilter } from "./tags-filter";

interface ProductFilterProps {
  title: string;
  className: string;
  children: React.ReactNode;
}

const ProductFilter = ({ title, className, children }: ProductFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon;
  return (
    <div className={cn("flex flex-col gap-2 border-b p-4", className)}>
      <div
        className="flex cursor-pointer items-center justify-between"
        onClick={() => setIsOpen((current) => !current)}
      >
        <p className="font-medium">{title}</p>
        <Icon className="size-5" />
      </div>
      {isOpen && children}
    </div>
  );
};

export const ProductFilters = () => {
  const [filters, setFilters] = useProductFilters();
  const onChange = (key: keyof typeof filters, value: unknown) => {
    setFilters({ ...filters, [key]: value });
  };
  // used to check if any filters to display CLEAR BUTTON
  const hasAnyFilters = Object.entries(filters).some(([key, value]) => {
    if (key === "sort") return false;
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    if (typeof value === "string") {
      return value !== "";
    }

    return value !== null;
  });
  const onClear = () => {
    setFilters({ minPrice: "", maxPrice: "", tags: [] });
  };

  return (
    <div className="rounded-md border bg-white">
      <div className="flex items-center justify-between border-b p-4">
        <p className="font-medium">Filters</p>
        {/* {hasAnyFilters && (
          <button
            className="cursor-pointer underline"
            onClick={() => onClear()}
            type="button"
          >
            Clear
          </button>
        )} */}
        <button
          className={`cursor-pointer underline transition-all duration-150 ease-linear ${hasAnyFilters ? "" : "pointer-events-none translate-x-40 opacity-0"}`}
          onClick={() => onClear()}
          type="button"
        >
          Clear
        </button>
      </div>
      <ProductFilter title="Price" className="">
        <PriceFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onMinPriceChange={(value) => onChange("minPrice", value)}
          onMaxPriceChange={(value) => onChange("maxPrice", value)}
        />
      </ProductFilter>
      <ProductFilter title="Tags" className="border-b-0">
        <TagsFilter
          value={filters.tags}
          onChange={(value) => onChange("tags", value)}
        />
      </ProductFilter>
    </div>
  );
};
