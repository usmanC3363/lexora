import React, { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";
import {
  Navbar,
  NavbarSkeleton,
} from "@/modules/tenants/ui/_components/navbar";
import { Footer } from "@/modules/tenants/ui/_components/footer";

type Props = {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
};

const Layout = async ({ children, params }: Props) => {
  const { slug } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.tenants.getOne.queryOptions({
      slug,
    }),
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F4F0]">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<NavbarSkeleton />}>
          <Navbar slug={slug} />
        </Suspense>
      </HydrationBoundary>
      <div className="flex-1">
        <div className="mx-auto max-w-(--breakpoint-xl) 2xl:max-w-(--breakpoint-2xl)">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
