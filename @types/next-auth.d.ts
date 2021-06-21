import 'next-auth/jwt';
import { Token } from '../lib/token';

declare module 'next-auth' {

   export interface Session {
      user?: {
         name: string
         email: string
         image: string
      }
      packToken?: Token
      expires?: string
   }

}