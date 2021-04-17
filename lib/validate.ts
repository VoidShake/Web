import Joi, { ValidationOptions } from 'joi'
import { NextApiHandler, NextApiRequest } from 'next'

type Schema = Record<string, Joi.Schema>

export default function validate(
   schema: {
      body?: Schema
      headers?: Schema
      query?: Schema
   },
   handlerOrOptions: NextApiHandler | ValidationOptions,
   handler?: NextApiHandler
): NextApiHandler {
   const h = typeof handlerOrOptions === 'function' ? handlerOrOptions : handler
   const o = typeof handlerOrOptions === 'function' ? {} : handlerOrOptions
   if (!h) throw new Error('NextApiHandler missing')

   const options: ValidationOptions = {
      allowUnknown: true,
      ...o,
   }

   const predicates = Object.entries(schema)
      .map(([key, blueprint]) => ({ schema: Joi.object(blueprint), key: key as keyof NextApiRequest }))
      .map(({ key, schema }) => (req: NextApiRequest) => schema.validate(req[key], options))

   return (req, res) => {
      const results = predicates.map(p => p(req))
      const error = results.map(r => r.error).find(e => !!e)

      if (error) {
         res.status(400).json({
            error: error.message,
         })
      } else {
         return h(req, res)
      }
   }
}
