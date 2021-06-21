import jwt from 'jsonwebtoken';
import { NextApiRequest } from "next";
import { Session } from "next-auth";
import { ApiError } from "next/dist/next-server/server/api-utils";
import Pack from "../database/models/Pack";

const KEY = process.env.JWT_SECRET

export interface Token {
   pack: string
   created: number
}

async function isAuthorized(session: Session, packId: string) {
   if (session.packToken) return packId === session.packToken.pack
   const pack = await Pack.findById(packId)
   return pack && session.user?.email === pack.author
}

export async function authorized(session: Session, packId: string) {
   if (!await isAuthorized(session, packId)) throw new ApiError(403, 'Unauthorized')
}

export async function getPack(session?: Session) {
   if (!session?.packToken) throw new ApiError(403, 'Only accessible using a pack token')
   const pack = await Pack.findById(session.packToken.pack)
   if (!pack) throw new ApiError(404, 'Pack not found')
   return pack
}

export function createToken(pack: string) {
   if (!KEY) throw new ApiError(500, 'No JWT Secret defined')
   const data: Token = { pack, created: Date.now() }
   return jwt.sign(data, KEY)
}

function decode(token: string) {
   if (!KEY) throw new ApiError(500, 'No JWT Secret defined')
   try {
      return jwt.verify(token, KEY) as Token
   } catch {
      throw new ApiError(400, 'Invalid pack token')
   }
}

export function tokenSession(req: NextApiRequest): Session | null {
   const [type, token] = req.headers.authorization?.split(' ') ?? []
   if (type === 'Bearer' || type === 'Token') {
      if (token) return { packToken: decode(token) }
   }
   return null
}