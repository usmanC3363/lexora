"use client";
import { Input } from "@/components/ui/input";
import { BookmarkCheckIcon, ListFilterIcon, SearchIcon } from "lucide-react";
import { CategoriesSidebar } from "./categories-sidebar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import Link from "next/link";

interface Props {
  disabled?: boolean;
}

export const SearchInput = ({ disabled }: Props) => {
  const trpc = useTRPC();
  const session = useQuery(trpc.auth.session.queryOptions());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex w-full items-center gap-2">
      <CategoriesSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
      <div className="relative w-full">
        <SearchIcon className="absolute top-1/2 left-4 size-4 -translate-1/2 text-neutral-500" />
        <Input
          placeholder="Search products"
          className="pl-8"
          disabled={disabled}
        />
      </div>
      <Button
        variant="elevated"
        className="flex size-12 shrink-0 lg:hidden"
        onClick={() => setIsSidebarOpen(true)}
      >
        <ListFilterIcon className="" />
      </Button>
      {session.data?.user && (
        <Button asChild variant="elevated" className="">
          <Link prefetch href="/library">
            <BookmarkCheckIcon />
            Library
          </Link>
        </Button>
      )}
    </div>
  );
};
