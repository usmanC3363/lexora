"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useProductFilters } from "../../hooks/use-product-filters";

interface Props {
  category?: string;
}
export const ProductList = ({ category }: Props) => {
  // extracting filters from function
  const [filters] = useProductFilters();

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.products.getMany.queryOptions({ category, ...filters }),
  );
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {data.docs.map((product) => (
        <div
          key={product.id}
          className="border-primary flex w-full flex-col justify-between gap-y-2.5 rounded-md border bg-white p-4"
        >
          <div className="flex flex-col gap-y-1">
            <p className="min-h-14 text-lg font-semibold capitalize">
              {product.name}
            </p>
            <p className="font-medium">${product.price}</p>
          </div>
          <p className="text-sm">{product.description}</p>
        </div>
      ))}
    </div>
  );
};

export const ProductListSkeleton = () => {
  return <div className="">Loading...</div>;
};
