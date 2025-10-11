import { DEFAULT_LIMIT } from "@/lib/constants";
import { loadProductFilers } from "@/modules/products/search-params";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { SearchParams } from "nuqs/server";

type Props = {
  searchParams: Promise<SearchParams>;
  params: Promise<{
    slug: string;
  }>;
};

const Page = async ({ searchParams, params }: Props) => {
  const { slug } = await params;
  const filters = await loadProductFilers(searchParams);
  // const plainFilters = JSON.parse(JSON.stringify(filters));
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      ...filters,
      tenantSlug: slug,
      limit: DEFAULT_LIMIT,
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView tenantSlug={slug} narrowView />
    </HydrationBoundary>
  );
};

export default Page;
