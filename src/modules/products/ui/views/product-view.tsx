"use client";
import { StarRating } from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, generateTenantURL } from "@/lib/utils";

import dynamic from "next/dynamic";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CheckCheckIcon, LinkIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";
import { RichText } from "@payloadcms/richtext-lexical/react";

interface ProductViewProps {
  productId: string;
  tenantSlug: string;
}

const CartButton = dynamic(
  () => import("../_components/cart-button").then((mod) => mod.CartButton),
  {
    ssr: false,
    loading: () => (
      <Button
        variant="elevated"
        className={`flex-1 bg-pink-400`}
        //   WIP may cause error
        disabled={true}
      >
        Add to Cart
      </Button>
    ),
  },
);
export const ProductView = ({ productId, tenantSlug }: ProductViewProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.products.getOne.queryOptions({ id: productId }),
  );
  return (
    <div className="px-4 py-10 lg:px-12">
      <div className="overflow-hidden rounded-sm border bg-white">
        {/* PRODUCT IMAGE */}
        <div className="relative aspect-[3.9] border-b">
          <Image
            src={data.image?.url || "/placeholder.png"}
            alt={data.name}
            fill
            className="object-cover"
          />
        </div>
        {/* Product Content Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-6">
          {/* 1st Column PRODUCT INFO */}
          <div className="col-span-4">
            {/* PRODUCT TITLE/NAME */}
            <div className="px-6 py-4">
              <h1 className="text-4xl font-medium">{data.name}</h1>
            </div>
            <div className="flex border-y">
              {/* PRICE */}
              <div className="flex items-center justify-center border-r px-6 py-4">
                <div className="w-fit border bg-pink-400 px-2 py-1">
                  <p className="text-base font-medium">
                    {formatCurrency(data.price)}
                  </p>
                </div>
              </div>
              {/* TENANT INFO */}
              <div className="flex w-fit items-center justify-center px-6 py-4 lg:border-r">
                <Link
                  href={generateTenantURL(tenantSlug)}
                  className="flex items-center gap-x-2"
                >
                  {data.tenant.image?.url && (
                    <Image
                      src={data.tenant?.image?.url || "/placeholder.png"}
                      alt={data.name}
                      width={20}
                      height={20}
                      className="size-[20px] shrink-0 rounded-full border"
                    />
                  )}
                  <p className="text-base font-medium capitalize underline">
                    {data.tenant.name}
                  </p>
                </Link>
              </div>
              {/* REVIEWS RATING on lg devices */}
              <div className="hidden items-center justify-center px-6 py-4 lg:flex">
                <div className="flex items-center gap-x-2">
                  <StarRating rating={data.reviewRating} />
                  <p className="text-base font-medium">
                    {data.reviewCount} ratings
                  </p>
                </div>
              </div>
            </div>
            {/* REVIEWS RATING on smaller < lg devices */}
            <div className="block items-center justify-center border-b px-6 py-4 lg:hidden">
              <div className="flex items-center gap-1">
                <StarRating rating={data.reviewRating} iconClassName="" />
                <p className="text-base font-medium">
                  {data.reviewCount} ratings
                </p>
              </div>
            </div>
            {/* OPTIONAL PRODCUT DESCRIPTION */}
            <div className="px-6 py-4">
              {data.description ? (
                <RichText data={data.description} />
              ) : (
                <p className="text-muted-foreground font-medium italic">
                  No description available
                </p>
              )}
            </div>
          </div>
          {/* SECOND COLUMN */}
          <div className="col-span-2">
            <div className="h-full border-t lg:border-t-0 lg:border-l">
              <div className="flex flex-col gap-4 border-b p-6">
                {/* ACTION BUTTONS */}
                <div className="flex items-center gap-2">
                  <CartButton
                    productId={productId}
                    tenantSlug={tenantSlug}
                    isPurchased={data.isPurchased}
                  />
                  <Button
                    variant="elevated"
                    className="size-12"
                    onClick={() => {
                      setIsCopied(true);
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Link copied to clipboard.");
                      setTimeout(() => {
                        setIsCopied(false);
                      }, 1500);
                    }}
                    disabled={isCopied}
                  >
                    <CheckCheckIcon
                      className={`absolute transition-all duration-200 ease-linear ${isCopied ? "" : "translate-y-8 opacity-0"}`}
                    />
                    <LinkIcon
                      className={`absolute transition-all duration-200 ease-linear ${isCopied ? "-translate-y-6 opacity-0" : ""}`}
                    />
                  </Button>
                </div>
                {/* REFUND POLICY INFO */}
                <p className="pb-[3px] text-center font-medium">
                  {data.refundPolicy === "no-refunds" ? (
                    "No refunds"
                  ) : (
                    <>
                      <span className="font-semibold">{data.refundPolicy}</span>
                      <span className=""> money back guarantee</span>
                    </>
                  )}
                </p>
              </div>
              {/* WIP: Add real ratings */}
              {/* RATINGS */}
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-medium">Ratings</h3>
                  <div className="flex items-center gap-x-2 font-medium">
                    <StarIcon className="size-4 fill-black" />
                    <p className="">({data.reviewRating})</p>
                    <p className="text-base">{data.reviewCount} ratings</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-[auto_1fr_auto] gap-3">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <React.Fragment key={stars}>
                      <div className="font-medium">
                        {stars} {stars === 1 ? "star" : "stars"}
                      </div>
                      <Progress
                        value={data.ratingDistribution[stars]}
                        className="h-[1lh]"
                      />
                      <div className="font-medium">
                        {data.ratingDistribution[stars]}%
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductViewSkeleton = () => {
  return (
    <div className="px-4 py-10 lg:px-12">
      <div className="overflow-hidden rounded-sm border bg-white">
        {/* PRODUCT IMAGE */}
        <div className="relative aspect-[3.9] border-b">
          <Image
            src={"/placeholder.png"}
            alt=""
            fill
            className="object-cover"
          />
        </div>
        {/* Product Content Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-6">
          {/* 1st Column PRODUCT INFO */}
          <div className="col-span-4">
            {/* PRODUCT TITLE/NAME */}
            <div className="min-h-16 px-6 py-4" />
            <div className="flex min-h-16 border-y">
              {/* PRICE */}
              <div className="flex min-w-24 items-center justify-center border-r px-6 py-4" />

              {/* TENANT INFO */}
              <div className="flex w-fit min-w-24 items-center justify-center px-6 py-4 lg:border-r" />

              {/* REVIEWS RATING on lg devices */}
              <div className="hidden items-center justify-center px-6 py-4 lg:flex">
                <div className="flex items-center gap-x-2">
                  <StarRating rating={0} />
                </div>
              </div>
            </div>

            {/* REVIEWS RATING on smaller < lg devices */}
            <div className="block items-center justify-center border-b px-6 py-4 lg:hidden">
              <div className="flex items-center gap-1">
                <StarRating rating={5} iconClassName="" />
              </div>
            </div>
            {/* OPTIONAL PRODCUT DESCRIPTION */}
            <div className="px-6 py-4"></div>
          </div>
          {/* SECOND COLUMN */}
          <div className="col-span-2">
            <div className="h-full border-t lg:border-t-0 lg:border-l">
              <div className="flex flex-col gap-4 border-b p-6">
                {/* ACTION BUTTONS */}
                <div className="flex min-h-20 items-center gap-2">
                  <Button
                    variant="elevated"
                    className={`flex-1 bg-pink-400`}
                    disabled={true}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="elevated"
                    className="size-12"
                    disabled={true}
                  >
                    <LinkIcon className={`absolute`} />
                  </Button>
                </div>
              </div>
              {/* WIP: Add real ratings */}
              {/* RATINGS */}
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-x-2 font-medium"></div>
                </div>
                <div className="mt-4 grid grid-cols-[auto_1fr_auto] gap-3">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <React.Fragment key={stars}>
                      <div className="font-medium">
                        {stars} {stars === 1 ? "star" : "stars"}
                      </div>
                      <Progress value={0} className="h-[1lh]" />
                      <div className="font-medium"></div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
