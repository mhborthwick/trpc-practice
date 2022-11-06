import { inferAsyncReturnType } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { NextApiRequest } from "next";
import { verifyJwt } from "../utils/jwt";
// import { getSession } from "next-auth/react";
import { prisma } from "../utils/prisma";

export interface CtxUser {
  id: string;
  email: string;
  name: string;
  iat: string;
  exp: number;
}

function getUserFromRequest(req: NextApiRequest) {
  const token = req.cookies.token;
  if (token) {
    try {
      const verified = verifyJwt<CtxUser>(token);
      return verified;
    } catch (err) {
      return null;
    }
  }
  return null;
}

export async function createContext(opts: trpcNext.CreateNextContextOptions) {
  // const session = await getSession({ req: opts.req });
  const { req, res } = opts;
  const user = getUserFromRequest(req);
  return {
    req,
    res,
    prisma,
    user,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
