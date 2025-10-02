import { cn } from "@/lib/utils";
import { Category } from "@/payload-types";
import Link from "next/link";
import React from "react";

type Props = {
  category: Category;
  isOpen: boolean;
  position: { top: number; left: number };
};

export const SubcategoryMenu = ({ category, isOpen, position }: Props) => {
  const subcategories = (
    category.subcategory &&
    "docs" in category.subcategory &&
    Array.isArray(category.subcategory.docs)
      ? category.subcategory.docs
      : []
  ) as Category[];
  if (!isOpen || !category.subcategory || subcategories.length < 0) {
    return null;
  }

  return (
    <div
      className="fixed z-100"
      style={{ top: position.top, left: position.left }}
    >
      {/*invisible gap between submenu and button  */}
      <div className="h-3 w-56" />
      <div
        className="flex h-52 w-56 translate-x-[2px] translate-y-[2px] flex-col gap-y-2.5 overflow-hidden rounded-md border p-4 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 ease-in-out"
        style={{
          backgroundColor: category.color ?? "#f5f5f5",
        }}
      >
        {subcategories.map((sub) => (
          <Link
            key={typeof sub === "string" ? sub : sub.id}
            href="/"
            className="z-110 font-medium text-black underline underline-offset-2 transition-all duration-200 ease-in-out hover:font-black hover:tracking-wide"
          >
            {typeof sub === "string" ? sub : sub.name}
          </Link>
        ))}
      </div>
    </div>
  );
};
