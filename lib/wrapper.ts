
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import database from "../database";

export interface AuthenticatedApiHandler {
   (req: NextApiRequest, res: NextApiResponse): void | Promise<void>
}

export default function wrapper(handler: AuthenticatedApiHandler): NextApiHandler {
   return async (req: NextApiRequest, res: NextApiResponse) => {
      await database()
      return handler(req, res)
   }
}