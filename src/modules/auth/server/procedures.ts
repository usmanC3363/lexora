import { headers as getHeaders, cookies as getCookies } from "next/headers";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { loginSchema, registerSchema } from "../schemas";
import { generateAuthCookies } from "../utils";

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();

    const session = await ctx.payload.auth({ headers });

    return session;
  }),

  register: baseProcedure
    .input(registerSchema)
    .mutation(async ({ input, ctx }) => {
      const existingData = await ctx.payload.find({
        collection: "users",
        limit: 1,
        where: {
          username: {
            equals: input.username,
          },
        },
        // data: {
        //   email: input.email,
        //   username: input.username,
        //   password: input.password, //hashed by payload automatically
        // },
      });

      const existingUser = existingData.docs[0];
      if (existingUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Username already taken",
        });
      }

      const tenant = await ctx.payload.create({
        collection: "tenants",
        data: {
          name: input.username,
          slug: input.username,
          stripeAccoutId: "test",
        },
      });

      await ctx.payload.create({
        collection: "users",
        data: {
          email: input.email,
          username: input.username,
          password: input.password, //hashed by payload automatically
          // has to be an array, allows for 1 user to have multiple stores
          tenants: [
            {
              tenant: tenant.id,
            },
          ],
        },
      });

      const data = await ctx.payload.login({
        collection: "users",
        data: {
          email: input.email,
          password: input.password, //hashed by payload automatically
        },
      });

      if (!data.token) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Failed to login",
        });
      }

      await generateAuthCookies({
        prefix: ctx.payload.config.cookiePrefix,
        value: data.token,
      });
    }),

  login: baseProcedure.input(loginSchema).mutation(async ({ input, ctx }) => {
    const data = await ctx.payload.login({
      collection: "users",
      data: {
        email: input.email,
        password: input.password, //hashed by payload automatically
      },
    });

    if (!data.token) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Failed to login",
      });
    }

    await generateAuthCookies({
      prefix: ctx.payload.config.cookiePrefix,
      value: data.token,
    });

    return data;
  }),
});
