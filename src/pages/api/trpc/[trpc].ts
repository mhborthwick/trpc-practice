import * as trpcNext from "@trpc/server/adapters/next";
import { NextApiRequest, NextApiResponse } from "next";
import { appRouter } from "../../../server/routers/_app";
import { createContext } from "../../../server/context";
// import { prisma } from "../../../utils/prisma";

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
});
