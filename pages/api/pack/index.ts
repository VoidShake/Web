import Joi from 'joi'
import { ApiError } from 'next/dist/next-server/server/api-utils'
import Pack from '../../../database/models/Pack'
import { forwardTokenRequest } from '../../../lib/token'
import validate from '../../../lib/validate'
import withSession, { methodSwitch } from '../../../lib/wrapper'
import updateHandler from './[id]'

const put = forwardTokenRequest(updateHandler)

const post = withSession(async (req, res, session) => {
   validate(req, {
      body: {
         name: Joi.string().required(),
      },
   })

   if (!session.user) throw new ApiError(403, 'Pack creation requires user')

   const pack = await Pack.create({ ...req.body, author: session.user.email })

   res.json(pack)
})

export default methodSwitch({ post, put })
