import { Media, Tenant } from "@/payload-types";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import type Stripe from "stripe";
import z from "zod";
import { CheckoutMetadata, ProductMetadata } from "../types";
import { stripe } from "@/lib/stripe";

export const checkoutRouter = createTRPCRouter({
  // verify procedure for stripe account creation
  verify: protectedProcedure.mutation(async ({ ctx }) => {
    // Finding user from session
    const user = await ctx.payload.findByID({
      collection: "users",
      id: ctx.session.user.id,
      depth: 0, //user.tenanas[0].tenant will be a string (tenantId)
    });
    // TRPC error handle
    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }
    // Finding user from user, depth: 0 to get it as string/Id
    const tenantId = user.tenants?.[0]?.tenant as string;
    const tenant = await ctx.payload.findByID({
      collection: "tenants",
      id: tenantId,
    });
    if (!tenant) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Tenant not found",
      });
    }
    const accountLink = await stripe.accountLinks.create({
      account: tenant.stripeAccoutId || "",
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL!}/`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL!}/`,
      type: "account_onboarding",
    });
    if (!accountLink) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to create verification link",
      });
    }
    return { url: accountLink.url };
  }),
  purchase: protectedProcedure
    .input(
      z.object({
        productIds: z.array(z.string()).min(1),
        tenantSlug: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const products = await ctx.payload.find({
        collection: "products",
        depth: 2,
        where: {
          and: [
            // two combinations of and
            {
              id: {
                in: input.productIds,
              },
            },
            {
              "tenant.slug": {
                equals: input.tenantSlug,
              },
            },
          ],
        },
      });
      if (products.totalDocs !== input.productIds.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product Not Found",
        });
      }

      const tenantsData = await ctx.payload.find({
        collection: "tenants",
        pagination: false,
        limit: 1,
        where: {
          slug: {
            equals: input.tenantSlug,
          },
        },
      });

      const tenant = tenantsData.docs[0];

      if (!tenant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tenant not Found",
        });
      }
      // WIP: Throw error if no stripe details are submitted

      // STRIPE FUNCTIONALIY IN CENTS
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
        products.docs.map((product) => ({
          quantity: 1,
          price_data: {
            unit_amount: product.price * 100,
            currency: "usd",
            product_data: {
              name: product.name,
              metadata: {
                stripeAccountId: tenant.stripeAccoutId,
                id: product.id,
                name: product.name,
                price: product.price,
              } as ProductMetadata,
            },
          },
        }));

      const checkout = await stripe.checkout.sessions.create({
        customer_creation: "always",
        customer_email: ctx.session.user.email,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${input.tenantSlug}/checkout?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${input.tenantSlug}/checkout?cancel=true`,
        mode: "payment",
        line_items: lineItems,
        invoice_creation: { enabled: true },
        metadata: {
          userId: ctx.session.user.id,
        } as CheckoutMetadata,
      });
      if (!checkout.url) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create checkout session",
        });
      }
      return { url: checkout.url };
    }),
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
        where: {
          id: {
            in: input.ids,
          },
        },
      });
      // WIP: Invalidate user data if local storage is compromised, need to check if below is efficient for our case
      if (data.totalDocs !== input.ids.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Products not found",
        });
      }
      return {
        ...data,
        totalPrice: data.docs.reduce((acc, product) => acc + product.price, 0),
        docs: data.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          // added for products displaying Tenant Info
          tenant: doc.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});
