import { Category } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async ({ ctx }) => {
    const data = await ctx.payload.find({
      collection: "categories",
      depth: 1, // Populates the subcategory with specified lvl of depth
      pagination: false,
      where: {
        parent: { exists: false }, //condition for only rendering parent category
      },
      sort: "name",
    });

    const formattedData = data.docs.map((doc) => ({
      ...doc,
      subcategories: (doc.subcategory?.docs ?? []).map((doc) => ({
        ...(doc as Category),
      })),
    }));

    return formattedData;
  }),
});
