import { Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const tenantsRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        // this cursor property must be present for infiniteQueryOptions to be available in tag-filter.tsx when calling for {data} from trpc
        slug: z.string(),
      }),
    )
    // destructuring ctx and input
    .query(async ({ ctx, input }) => {
      const tenantsData = await ctx.payload.find({
        collection: "tenants",
        where: {
          slug: {
            equals: input.slug,
          },
        },
        pagination: false,
        limit: 1,
      });

      const tenant = tenantsData.docs[0];

      if (!tenant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tenant not found",
        });
      }
      return tenant as Tenant & { image: Media | null };
    }),
});
