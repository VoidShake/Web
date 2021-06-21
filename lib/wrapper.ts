
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/client";
import { ApiError } from "next/dist/next-server/server/api-utils";
import database from "../database";
import { tokenSession } from "./token";

export interface AuthenticatedApiHandler {
   (req: NextApiRequest, res: NextApiResponse, session: Session): void | Promise<void>
}

export default function wrapper(handler: AuthenticatedApiHandler): NextApiHandler {
   return async (req: NextApiRequest, res: NextApiResponse) => {

      await database()

      const session = tokenSession(req) ?? await getSession({ req })

      if (!session) throw new ApiError(403, 'Unauthorized')

      return handler(req, res, session)
   }
}