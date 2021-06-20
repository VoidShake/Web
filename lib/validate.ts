import Joi, { ValidationOptions } from 'joi'
import { NextApiHandler, NextApiRequest } from 'next'
import wrapper, { AuthenticatedApiHandler } from './wrapper'

type Schema = Record<string, Joi.Schema>

type SchemaKey = 'body' | 'headers' | 'query'

type RequestSchema = {
   [K in SchemaKey]?: Schema
}

export default function validate(
   schema: RequestSchema,
   handlerOrOptions: AuthenticatedApiHandler | ValidationOptions,
   handler?: AuthenticatedApiHandler
): NextApiHandler {
   const h = typeof handlerOrOptions === 'function' ? handlerOrOptions : handler
   const o = typeof handlerOrOptions === 'function' ? {} : handlerOrOptions
   if (!h) throw new Error('NextApiHandler missing')

   const options: ValidationOptions = {
      stripUnknown: true,
      ...o,
   }

   const predicates = Object.entries(schema)
      .map(([key, blueprint]) => ({ schema: Joi.object(blueprint), key: key as keyof NextApiRequest }))
      .map(({ key, schema }) => (req: NextApiRequest) => schema.validate(req[key], options))

   return wrapper((req, res) => {
      const results = predicates.map(p => p(req))
      const error = results.map(r => r.error).find(e => !!e)

      if (error) {
         res.status(400).json({
            error: error.message,
         })
      } else {

         Object.keys(schema).map(k => k as SchemaKey).forEach((key, i) => {
            req[key] = results[i].value
         })

         return h(req, res)
      }
   })
}
