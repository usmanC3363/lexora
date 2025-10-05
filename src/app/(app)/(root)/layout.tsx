import React, { Suspense } from "react";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { Navbar } from "./_components/navbar";
import { Footer } from "./_components/footer";
import {
  SearchFilters,
  SearchFiltersSkeleton,
} from "./_components/search-filters";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  // prefetching categories from server to display fast
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      {/* Hydration Boundary */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<SearchFiltersSkeleton />}>
          <SearchFilters />
        </Suspense>
      </HydrationBoundary>
      <div className="flex-1 bg-[#f4f4f0]">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
