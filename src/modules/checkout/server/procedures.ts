import { Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";

export const checkoutRouter = createTRPCRouter({
  getProducts: baseProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
      }),
    )
    // destructuring ctx and input
    .query(async ({ ctx, input }) => {
      const data = await ctx.payload.find({
        collection: "products",
        depth: 2, // Populates with image, category, tenant data
      });
      return {
        ...data,
        docs: data.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          // added for products displaying Tenant Info
          tenant: doc.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});
