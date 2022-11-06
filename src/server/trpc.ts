import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { Context } from "./context";

const t = initTRPC.context<Context>().create({ transformer: superjson });
export const router = t.router;
export const publicProcedure = t.procedure;

/**
 * Reusable middleware that checks if users are authenticated.
 * @note Example only, yours may vary depending on how your auth is setup
 **/
const isAuthed = t.middleware(({ next, ctx }) => {
  // TODO: Fix this later
  // if (!ctx.session?.user?.email) {
  //   throw new TRPCError({
  //     code: "UNAUTHORIZED",
  //   });
  // }
  // return next({
  //   ctx: {
  //     // Infers the `session` as non-nullable
  //     session: ctx.session,
  //   },
  // });
  return next({
    ctx: {
      session: true,
    },
  });
});

// Protected procedures for logged in users only
export const protectedProcedure = t.procedure.use(isAuthed);
