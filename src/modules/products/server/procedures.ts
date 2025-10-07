import { Category } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Where } from "payload";
import z from "zod";

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        category: z.string().nullable().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
      }),
    )
    // destructuring ctx and input
    .query(async ({ ctx, input }) => {
      const where: Where = {};

      // Price Filters
      if (input.minPrice) {
        where.price = { greater_than_equal: input.minPrice };
      }

      if (input.maxPrice) {
        where.price = { less_than_equal: input.maxPrice };
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

      const data = await ctx.payload.find({
        collection: "products",
        depth: 1, // Populates with image and category
        where,
      });
      return data;
    }),
});
