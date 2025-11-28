import { Category, Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Sort, Where } from "payload";
import z from "zod";
import { sortValues } from "../search-params";
import { DEFAULT_LIMIT } from "@/lib/constants";
import { headers as getHeaders } from "next/headers";
import { TRPCError } from "@trpc/server";

export const productsRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const headers = await getHeaders();
      const session = await ctx.payload.auth({ headers });

      const product = await ctx.payload.findByID({
        collection: "products",
        id: input.id,
        depth: 2,
        select: {
          // this is for not leaking to api
          content: false,
        },
        // WIP: configure depth for images and internal data
      });

      if (product.isArchived) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      let isPurchased = false;

      if (session.user) {
        const ordersData = await ctx.payload.find({
          collection: "orders",
          limit: 1,
          pagination: false,

          where: {
            and: [
              {
                product: {
                  equals: input.id,
                },
              },
              {
                user: {
                  equals: session.user.id,
                },
              },
            ],
          },
        });

        isPurchased = !!ordersData.docs[0];
      }

      const reviews = await ctx.payload.find({
        collection: "reviews",
        pagination: false,
        where: { product: { equals: input.id } },
      });

      const reviewRating =
        reviews.docs.length > 0
          ? reviews.docs.reduce((acc, review) => acc + review.rating, 0) /
            reviews.totalDocs
          : 0;

      const ratingDistribution: Record<number, number> = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      };

      if (reviews.totalDocs > 0) {
        reviews.docs.forEach((review) => {
          const rating = review.rating;

          if (rating >= 1 && rating <= 5) {
            ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
          }
        });

        Object.keys(ratingDistribution).forEach((key) => {
          const rating = Number(key);
          const count = ratingDistribution[rating] || 0;
          ratingDistribution[rating] = Math.round(
            (count / reviews.totalDocs) * 100,
          );
        });
      }
      return {
        ...product,
        isPurchased,
        image: product.image as Media | null,
        tenant: product.tenant as Tenant & { image: Media | null },
        reviewRating,
        reviewCount: reviews.totalDocs,
        ratingDistribution,
      };
    }),
  getMany: baseProcedure
    .input(
      z.object({
        // used for infiniteQueryOptions
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
        search: z.string().nullable().optional(),
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
      // Global where Initialization from payload Where
      const where: Where = { isArchived: { not_equals: true } };

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
      } else {
        // these products only show up on tenantStore and not on public storefront
        where["isPrivate"] = {
          not_equals: true,
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

      // TAGS
      if (input.tags && input.tags.length > 0) {
        where["tags.name"] = {
          in: input.tags,
        };
      }

      // Search options
      if (input.search) {
        where["name"] = {
          like: input.search,
        };
      }
      const data = await ctx.payload.find({
        collection: "products",
        depth: 2, // Populates with image, category, tenant data
        where,
        sort,
        page: input.cursor,
        limit: input.limit,
        select: {
          // this is for not leaking to api
          content: false,
        },
      });

      // Review Aggregation, Promise.all helps with async func inside map
      const dataWithSummarizedReviews = await Promise.all(
        data.docs.map(async (doc) => {
          const reviewsData = await ctx.payload.find({
            collection: "reviews",
            pagination: false,
            where: {
              product: {
                equals: doc.id,
              },
            },
          });
          return {
            ...doc,
            reviewCount: reviewsData.totalDocs,
            reviewRating:
              reviewsData.docs.length === 0
                ? 0
                : reviewsData.docs.reduce(
                    (acc, review) => acc + review.rating,
                    0,
                  ) / reviewsData.totalDocs,
          };
        }),
      );
      return {
        ...data,
        docs: dataWithSummarizedReviews.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          // added for products displaying Tenant Info
          tenant: doc.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});
