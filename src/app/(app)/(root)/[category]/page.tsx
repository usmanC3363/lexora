import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { SearchParams } from "nuqs/server";
import React from "react";
import { loadProductFilers } from "@/modules/products/search-params";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";

type Props = {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<SearchParams>;
};

const Page = async ({ params, searchParams }: Props) => {
  const { category } = await params;
  const filters = await loadProductFilers(searchParams);
  // const plainFilters = JSON.parse(JSON.stringify(filters));
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({ category, ...filters }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView category={category} />
    </HydrationBoundary>
  );
};

export default Page;
