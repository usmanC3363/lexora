import { Category, Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Sort, Where } from "payload";
import z from "zod";
import { sortValues } from "../search-params";
import { DEFAULT_LIMIT } from "@/lib/constants";

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        // used for infiniteQueryOptions
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
        category: z.string().nullable().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
        tags: z.array(z.string()).nullable().optional(),
        sort: z.enum(sortValues).nullable().optional(),
        tenantSlug: z.string().nullable().optional(),
      }),
    )
    // destructuring ctx and input
    .query(async ({ ctx, input }) => {
      let sort: Sort = "-createdAt";

      if (input.sort === "curated") {
        sort = "name";
      }
      if (input.sort === "trending") {
        sort = "+createdAt";
      }
      if (input.sort === "popular") {
        sort = "-createdAt";
      }
      const where: Where = {};

      // Price Filters
      if (input.minPrice) {
        where.price = { greater_than_equal: input.minPrice };
      }

      if (input.maxPrice) {
        where.price = { less_than_equal: input.maxPrice };
      }

      if (input.tenantSlug) {
        where["tenant.slug"] = {
          equals: input.tenantSlug,
        };
      }
      if (input.category) {
        // Fetching categoriesData
        const categoriesData = await ctx.payload.find({
          collection: "categories",
          limit: 1,
          depth: 1, //Populates subcategories, subcategories[0] will be of type Category
          pagination: false,
          where: {
            slug: { equals: input.category },
          },
        });
        const formattedData = categoriesData.docs.map((doc) => ({
          ...doc,
          subcategories: (doc.subcategory?.docs ?? []).map((doc) => ({
            ...(doc as Category),
            // subcategory: undefined,
          })),
        }));
        // the first and only one present in the array due to limit 1
        const subcategoriesSlugs = [];
        const parentCategory = formattedData[0];
        if (parentCategory) {
          subcategoriesSlugs.push(
            ...parentCategory.subcategories.map(
              (subcategory) => subcategory.slug,
            ),
          );
          // putting this here checks for parentCategory, rule "noUncheckedIndexedAccess" added in tsconfig, it solves obscure issue favicon.ico getting fetched like categories
          where["category.slug"] = {
            in: [parentCategory.slug, ...subcategoriesSlugs],
          };
        }
      }

      if (input.tags && input.tags.length > 0) {
        where["tags.name"] = {
          in: input.tags,
        };
      }
      const data = await ctx.payload.find({
        collection: "products",
        depth: 2, // Populates with image, category, tenant data
        where,
        sort,
        page: input.cursor,
        limit: input.limit,
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
