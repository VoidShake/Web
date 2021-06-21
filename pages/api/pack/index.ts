import Joi from 'joi'
import { ApiError } from 'next/dist/next-server/server/api-utils'
import Pack from '../../../database/models/Pack'
import validate from '../../../lib/validate'

const handler = validate(
   {
      body: {
         name: Joi.string().required(),
      },
   },
   async (req, res, session) => {

      if (!session.user) throw new ApiError(403, 'Pack creation requires user')

      if (req.method === 'POST') {

         const pack = await Pack.create({ ...req.body, author: session.user.email })

         return res.json(pack)
      }

      res.status(400).send({ error: 'Invalid method' })
   }
)

export default handler
