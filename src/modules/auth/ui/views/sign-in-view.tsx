/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import z from "zod";
import { loginSchema } from "../../schemas";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const SignInView = () => {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const login = useMutation(
    trpc.auth.login.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.auth.session.queryFilter());
        router.push("/");
      },
    }),
  );

  const [isLoading, setIsLoading] = useState(false);
  // using this schema from registerSchema at modules/schema.ts
  const form = useForm<z.infer<typeof loginSchema>>({
    // used for checking errors and display them as user types
    mode: "all",
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    login.mutate(values);
  };

  return (
    <div className="grid w-screen grid-cols-1 lg:grid-cols-5">
      <div className="min-w-[50vw]">
        <Form {...form}>
          <form
            className="flex flex-col gap-8 p-4 lg:p-16"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="mb-8 flex items-center justify-between">
              <Link href="/" className={`text-2xl font-medium`}>
                Lexora
              </Link>

              <Button
                type="submit"
                variant="ghost"
                className="group self-start transition-all duration-100 ease-linear hover:bg-[#2F006B] hover:text-white"
              >
                <Link href="/" className={`text-base font-medium`}>
                  Sign Up
                </Link>
              </Button>
            </div>
            <h1 className="text-4xl font-medium">Welcomeback to Lexora</h1>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your email"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your password"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="lg"
              variant="elevated"
              disabled={login.isPending}
              className="group hover:text-primary self-start bg-black text-white transition-all duration-100 ease-linear hover:bg-pink-400"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging In
                </>
              ) : (
                <span className="transition-all duration-150 ease-linear">
                  Log In
                </span>
              )}
            </Button>
          </form>
        </Form>
      </div>
      <div
        className="hidden h-screen w-full lg:col-span-3 lg:col-start-4 lg:block"
        style={{
          backgroundImage: "url('/sign-up.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
    </div>
  );
};
