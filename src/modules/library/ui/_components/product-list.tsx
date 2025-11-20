"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import ProductCard, { ProductCardSkeleton } from "./product-card";
import { DEFAULT_LIMIT } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { InboxIcon } from "lucide-react";

export const ProductList = () => {
  const trpc = useTRPC();
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(
      trpc.library.getMany.infiniteQueryOptions(
        { limit: DEFAULT_LIMIT },
        {
          getNextPageParam: (lastPage) => {
            return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
          },
        },
      ),
    );

  if (data.pages?.[0]?.docs.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-y-4 rounded-lg border border-dashed border-black bg-white p-8">
        <InboxIcon />
        No Products Found
      </div>
    );
  }
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3">
        {data.pages
          .flatMap((page) => page.docs)
          .map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              description={product?.description}
              imageUrl={product.image?.url}
              tenantSlug={product.tenant?.slug}
              tenantImageUrl={product.tenant?.image?.url}
              reviewRating={3}
              reviewCount={5}
            />
          ))}
      </div>
      <div className="flex justify-center pt-8">
        {hasNextPage && (
          <Button
            variant="elevated"
            type="button"
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
            className="bg-white text-base font-medium disabled:opacity-50"
          >
            Load More
          </Button>
        )}
      </div>
    </>
  );
};

export const ProductListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};
