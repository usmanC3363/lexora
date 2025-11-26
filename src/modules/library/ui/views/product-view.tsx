"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { BackButton } from "@/components/back-button";
import { ReviewSidebar } from "@/modules/library/ui/_components/review-sidebar";
import { RichText } from "@payloadcms/richtext-lexical/react";

interface ProductViewProps {
  productId: string;
}
export const ProductView = ({ productId }: ProductViewProps) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.library.getOne.queryOptions({
      productId,
    }),
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-(--breakpoint-xl) border-b bg-[#F4F4F0] px-4 lg:px-12 2xl:max-w-(--breakpoint-2xl)">
        <BackButton
          text="Back to Library"
          ArrowClass="size-[18px]"
          linkUrl="/library"
        />
      </div>
      <header className="border-b bg-[#F4F4F0] py-8">
        <div className="mx-auto max-w-(--breakpoint-xl) px-4 lg:px-12 2xl:max-w-(--breakpoint-2xl)">
          <h1 className="text-[40px] font-medium">{data.name}</h1>
        </div>
      </header>
      <section className="mx-auto max-w-(--breakpoint-xl) px-4 py-10 lg:px-12 2xl:max-w-(--breakpoint-2xl)">
        <div className="grid grid-cols-1 gap-y-6 lg:grid-cols-7 lg:gap-x-16">
          <div className="lg:col-span-2">
            <div className="gap-4 rounded-md border bg-white p-4">
              <ReviewSidebar productId={productId} />
            </div>
          </div>
          <div className="lg:col-span-5">
            {data.content ? (
              <RichText data={data.content} />
            ) : (
              <p className="text-muted-foreground w-fit font-medium italic">
                No special content
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
