"use client";
import z from "zod";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.auth.session.queryOptions());
  return (
    <main className="flex flex-col gap-4">
      Homepage
      {JSON.stringify(data?.user, null, 2)}
    </main>
  );
}
