"use client";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";

const Page = () => {
  const trpc = useTRPC();
  const { mutate: verify } = useMutation(
    trpc.checkout.verify.mutationOptions({
      onSuccess: (data) => {
        window.location.href = data.url;
      },
      onError: (error) => {
        console.log(error);
        window.location.href = "/";
      },
    }),
  );

  useEffect(() => {
    verify();
  }, [verify]);
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="text-muted-foreground animate-spin" />
    </div>
  );
};

export default Page;
