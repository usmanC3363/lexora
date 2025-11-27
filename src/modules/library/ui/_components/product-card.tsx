"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { StarIcon } from "lucide-react";
import { RichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "lexical";

{
  /* WIP: Add real ratings */
}

type ProductCardProps = {
  id: string;
  name: string;
  description: SerializedEditorState | undefined;
  imageUrl?: string | null;
  tenantSlug: string;
  tenantImageUrl?: string | null;
  reviewRating: number;
  reviewCount: number;
};

const ProductCard = ({
  id,
  name,
  description,
  imageUrl,
  tenantSlug,
  tenantImageUrl,
  reviewRating,
  reviewCount,
}: ProductCardProps) => {
  return (
    <Link prefetch href={`/library/${id}`}>
      <div className="flex h-full flex-col justify-between gap-y-4 overflow-hidden rounded-md border bg-white p-4 transition-shadow hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] lg:min-w-72">
        {/* PRODUCT IMAGE */}
        <div className="relative h-44">
          <Image
            src={imageUrl || "/placeholder.png"}
            alt={name}
            fill
            className="rounded-sm object-cover"
          />
        </div>

        {/* PRODUCT CONTENT MAIN DIV */}
        <div className="flex flex-1 flex-col justify-between gap-y-6">
          <div className="flex flex-col gap-y-2.5">
            {/* PRODUCT NAME */}
            <h2 className="line-clamp-1 text-lg leading-[140%] font-semibold">
              {name}
            </h2>
            {/* PRODUCT DESCRIPTION */}
            {/* line-clamp-3 text-sm */}
            {description ? <RichText data={description} /> : null}
          </div>

          {/* PRODUCT tenantSlug & Image, Review count Div */}
          <div className="flex flex-col gap-2">
            {/* PRODUCT tenantSlug & Image Div */}
            <div className="group flex w-fit items-center gap-3">
              <div className="flex w-fit gap-2.5">
                {tenantImageUrl && (
                  <Image
                    src={tenantImageUrl}
                    alt={tenantSlug}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                {/* PRODUCT tenantSlug */}
                <p className="text-sm font-medium capitalize underline transition-all ease-linear group-hover:tracking-wide">
                  {tenantSlug}
                </p>
                {reviewCount > 0 && (
                  <div className="flex items-center gap-1">
                    <StarIcon className="size-3.5 fill-black" />
                    <p className="text-sm font-medium">
                      {reviewRating} ({reviewCount})
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

export const ProductCardSkeleton = () => {
  return (
    <div className="aspect-3/4 w-full animate-pulse rounded-lg bg-neutral-200"></div>
  );
};
