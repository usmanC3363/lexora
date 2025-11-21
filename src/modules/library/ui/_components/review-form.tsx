"use client";
import { ReviewsGetOneOutput } from "@/modules/reviews/types";
import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { StarPicker } from "@/components/star-picker";

interface ReviewFormProps {
  initialData: ReviewsGetOneOutput;
  productId: string;
}
const formSchema = z.object({
  rating: z.number().min(1, { message: "Rating is required" }).max(5),
  description: z.string().min(1, { message: "Description is required" }),
});

export const ReviewForm = ({ initialData, productId }: ReviewFormProps) => {
  // if we already have review(initialData = true)
  const [isPreview, setIsPreview] = useState(!!initialData);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: initialData?.rating ?? 0,
      description: initialData?.description ?? "",
    },
  });

  const handleOnSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-y-4"
        onSubmit={form.handleSubmit(handleOnSubmit)}
      >
        <p className="font-medium">
          {isPreview ? "Your Rating" : "Liked it? Give it a rating"}
        </p>
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel className="text-base">email</FormLabel> */}
              <FormControl>
                <StarPicker
                  value={field.value}
                  disabled={isPreview}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel className="text-base">email</FormLabel> */}
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Want to leave a review?"
                  disabled={isPreview}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!isPreview && (
          <Button
            variant="elevated"
            disabled={false}
            type="submit"
            size="lg"
            className="hover:text-primary mt-0.5 mb-1 h-9 w-fit bg-black px-3.5 text-white hover:bg-pink-400"
          >
            {initialData ? "Update review" : "Post Review"}
          </Button>
        )}
      </form>
      {isPreview && (
        <Button
          onClick={() => setIsPreview(false)}
          variant="elevated"
          type="button"
          size="lg"
          className="mt-4 mb-1.5 h-9 w-fit"
        >
          Edit
        </Button>
      )}
    </Form>
  );
};
