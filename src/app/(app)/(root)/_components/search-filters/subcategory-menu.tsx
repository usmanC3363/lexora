import { CategoriesGetManyOutput } from "@/modules/categories/types";
import Link from "next/link";
import React from "react";

type Props = {
  category: CategoriesGetManyOutput[1];
  isOpen: boolean;
};

export const SubcategoryMenu = ({ category, isOpen }: Props) => {
  if (
    !isOpen ||
    !category.subcategories ||
    category.subcategories.length === 0
  ) {
    return null;
  }

  return (
    <div className="absolute top-[100%] left-0 z-100">
      {/*invisible gap between submenu and button  */}
      <div className="pointer-events-none h-3 w-56 opacity-0" />
      <div
        className="flex h-fit w-56 translate-x-[2px] translate-y-[2px] flex-col gap-y-3 overflow-hidden rounded-md border px-4 pt-4 pb-8 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] transition-all duration-200 ease-in-out"
        style={{
          backgroundColor: category.color ?? "#f5f5f5",
        }}
      >
        {category.subcategories.map((sub) => (
          <Link
            key={typeof sub === "string" ? sub : sub.id}
            href={`/${category.slug}/${sub.slug}`}
            className="z-110 font-medium text-black underline transition-all duration-200 ease-in-out hover:font-black hover:tracking-wide"
          >
            {typeof sub === "string" ? sub : sub.name}
          </Link>
        ))}
      </div>
    </div>
  );
};
