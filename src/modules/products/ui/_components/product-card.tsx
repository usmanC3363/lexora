import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type ProductCardProps = {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  authorUsername: string;
  authorImageUrl?: string | null;
  reviewRating: number;
  reviewCount: number;
  price: number;
};

const ProductCard = ({
  id,
  name,
  description,
  imageUrl,
  authorUsername,
  authorImageUrl,
  reviewRating,
  reviewCount,
  price,
}: ProductCardProps) => {
  return (
    <Link href={`/products/${id}`}>
      <div className="flex h-full flex-col justify-between gap-y-4 overflow-hidden rounded-md border bg-white p-4 transition-shadow hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        {/* PRODUCT IMAGE */}
        <div className="relative h-44">
          <Image
            src={imageUrl || "/placeholder.png"}
            alt={name}
            fill
            className="rounded-sm object-cover"
          />
        </div>

        <div className="flex flex-1 flex-col gap-y-3">
          <div className="flex flex-col gap-y-0">
            <h2 className="line-clamp-4 min-h-14 text-lg font-semibold">
              {name}
            </h2>
            <p className="text-sm">{description}</p>
          </div>
          <div className="" onClick={() => {}}>
            {authorImageUrl && (
              <Image
                src={authorImageUrl || ""}
                alt={authorUsername}
                width={16}
                height={16}
                className="rounded-sm object-cover"
              />
            )}
            <p className="text-sm font-semibold capitalize underline">
              {authorUsername}
            </p>
          </div>

          {reviewCount > 0 && (
            <div className="flex items-center gap-1">
              <StarIcon className="size-3.5 fill-black" />
              <p className="text-sm font-medium">
                {reviewRating} ({reviewCount})
              </p>
            </div>
          )}
        </div>

        <div className="border-t pt-4 pb-2">
          <div className="relative w-fit bg-pink-400 px-3 py-1">
            <p className="text-sm font-medium">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              }).format(Number(price))}
            </p>
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
