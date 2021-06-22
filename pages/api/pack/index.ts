import Joi from 'joi'
import { NextApiHandler } from 'next'
import { ApiError } from 'next/dist/next-server/server/api-utils'
import Pack from '../../../database/models/Pack'
import { forwardTokenRequest } from '../../../lib/token'
import validate from '../../../lib/validate'
import wrapper from '../../../lib/wrapper'
import updateHandler from './[id]'

const handler: NextApiHandler = (req, res) => {

   if (req.method === 'POST') return postRequest(req, res)
   if (req.method === 'PUT') return putRequest(req, res)

   res.status(400).send({ error: 'Invalid method' })

}

const putRequest = forwardTokenRequest(updateHandler)

const postRequest = wrapper(async (req, res, session) => {

   validate(req, {
      body: {
         name: Joi.string().required(),
      },
   })

   if (!session.user) throw new ApiError(403, 'Pack creation requires user')

   const pack = await Pack.create({ ...req.body, author: session.user.email })

   res.json(pack)

})

export default handler
