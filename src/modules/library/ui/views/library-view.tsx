import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { ProductList, ProductListSkeleton } from "../_components/product-list";
import { Suspense } from "react";

interface LibraryViewProps {
  className?: string;
}
export const LibraryView = ({ className }: LibraryViewProps) => {
  return (
    <div className="min-h-screen bg-white">
      <nav className="w-full border-b bg-[#F4F4F0] p-4">
        <Link prefetch href={`/`} className="flex items-center gap-2">
          <ArrowLeftIcon className="size-4" />
          <span className="font-medium">Continue Shopping</span>
        </Link>
      </nav>
      <header className="border-b bg-[#F4F4F0] py-8">
        <div className="mx-auto flex max-w-(--breakpoint-xl) flex-col gap-y-4 px-4 lg:px-12 2xl:max-w-(--breakpoint-2xl)">
          <h1 className="text-[40px] font-medium">Library</h1>
          <p className="font-medium">Your Purchases and reviews</p>
        </div>
      </header>
      <section className="mx-auto max-w-(--breakpoint-xl) px-4 py-10 lg:px-12 2xl:max-w-(--breakpoint-2xl)">
        <Suspense fallback={<ProductListSkeleton />}>
          <ProductList />
        </Suspense>
      </section>
    </div>
  );
};
