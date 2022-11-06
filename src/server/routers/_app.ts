import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { z } from "zod";
import {
  createUserSchema,
  requestOtpSchema,
  verifyOtpSchema,
} from "../../schema/user.schema";
import { publicProcedure, router } from "../trpc";
import * as trpc from "@trpc/server";
import { sendLoginEmail } from "../../utils/mailer";
import { getBaseUrl } from "../../utils/trpc";
import { encode, decode } from "../../utils/base64";
import { signJwt } from "../../utils/jwt";
import { serialize } from "cookie";
import { addSongSchema, getSingleSongSchema } from "../../schema/post.schema";

// TODO: clean this up later
export const helloRouter = router({
  hello: publicProcedure
    .input(
      z.object({
        text: z.string().nullish(),
      })
    )
    .query(({ input, ctx }) => {
      // console.log(ctx.prisma);
      return {
        greeting: `hello ${input?.text ?? "world"}`,
      };
    }),
});

// TODO: Start here tomorrow!! video at 1:37:08
export const songRouter = router({
  addSong: publicProcedure
    .input(addSongSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        new trpc.TRPCError({
          code: "FORBIDDEN",
          message: "Cannot add a song while logged out!",
        });
      }
      const song = await ctx.prisma.song.create({
        data: {
          ...input,
          user: {
            connect: {
              id: ctx.user?.id,
            },
          },
        },
      });
      return song;
    }),
  songs: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.song.findMany();
  }),
  singleSong: publicProcedure
    .input(getSingleSongSchema)
    .query(({ input, ctx }) => {
      return ctx.prisma.song.findUnique({
        where: {
          id: input.songId,
        },
      });
    }),
});

export const userRouter = router({
  me: publicProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
  verifyOtp: publicProcedure
    .input(verifyOtpSchema)
    .query(async ({ input, ctx }) => {
      const decoded = decode(input.hash).split(":");
      const [id, email] = decoded;
      const token = await ctx.prisma.loginToken.findFirst({
        where: {
          id,
          user: {
            email,
          },
        },
        include: {
          user: true,
        },
      });
      if (!token) {
        throw new trpc.TRPCError({
          code: "FORBIDDEN",
          message: "Invalid token!",
        });
      }
      const jwt = signJwt({
        email: token.user.email,
        id: token.user.id,
      });
      ctx.res.setHeader("Set-Cookie", serialize("token", jwt, { path: "/" }));
      return {
        redirect: token.redirect,
      };
    }),
  requestOtp: publicProcedure
    .input(requestOtpSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, redirect } = input;
      const user = await ctx.prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        throw new trpc.TRPCError({
          code: "NOT_FOUND",
          message: "User not found!",
        });
      }
      const token = await ctx.prisma.loginToken.create({
        data: {
          redirect,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });
      await sendLoginEmail({
        token: encode(`${token.id}:${user.email}`),
        url: getBaseUrl(),
        email: user.email,
      });
      return true;
    }),
  user: publicProcedure
    .input(createUserSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, name } = input;
      try {
        const user = await ctx.prisma.user.create({
          data: {
            email,
            name,
          },
        });
        return user;
      } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
          if (err.code === "P2002") {
            throw new trpc.TRPCError({
              code: "CONFLICT",
              message: "User already exists!",
            });
          }
        }
        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong!",
        });
      }
    }),
});

export const appRouter = router({
  hello: helloRouter,
  user: userRouter,
  song: songRouter,
});

export type AppRouter = typeof appRouter;
