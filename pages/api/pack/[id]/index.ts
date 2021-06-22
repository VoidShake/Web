import Joi from 'joi'
import { ApiError } from 'next/dist/next-server/server/api-utils'
import Pack from '../../../../database/models/Pack'
import { authorized } from '../../../../lib/token'
import validate from '../../../../lib/validate'
import wrapper from '../../../../lib/wrapper'

const handler = wrapper(async (req, res, session) => {

   if (req.method === 'PUT') {

      const id = req.query.id as string
      await authorized(session, id)

      validate(req, {
         query: {
            id: Joi.string().required(),
         },
         body: {
            name: Joi.string().optional(),
            description: Joi.string().optional(),
            links: Joi.object().pattern(/^/, Joi.string())
         },
      })

      const updated = await Pack.findByIdAndUpdate(id, req.body)
      if (!updated) throw new ApiError(404, 'Pack not found')

      return res.json(updated)
   }

   res.status(400).send({ error: 'Invalid method' })
}
)

export default handler
