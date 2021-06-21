import Joi from 'joi'
import { ApiError } from 'next/dist/next-server/server/api-utils'
import Pack from '../../../database/models/Pack'
import { getPack } from '../../../lib/token'
import validate from '../../../lib/validate'
import wrapper from '../../../lib/wrapper'

const handler = wrapper(
   async (req, res, session) => {

      if (req.method === 'POST') {

         validate(req, {
            body: {
               name: Joi.string().required(),
            },
         })

         if (!session.user) throw new ApiError(403, 'Pack creation requires user')

         const pack = await Pack.create({ ...req.body, author: session.user.email })

         return res.json(pack)
      }

      if (req.method === 'PUT') {

         validate(req, {
            body: {
               name: Joi.string().optional(),
               description: Joi.string().optional(),
               links: Joi.object().pattern(/^/, Joi.string())
            },
         })

         const { id } = await getPack(session)

         await Pack.findByIdAndUpdate(id, req.body)

         return res.status(204).end()
      }

      res.status(400).send({ error: 'Invalid method' })
   }
)

export default handler
