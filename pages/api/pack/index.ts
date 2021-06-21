import Joi from 'joi'
import { ApiError } from 'next/dist/next-server/server/api-utils'
import Pack from '../../../database/models/Pack'
import { getMods } from '../../../lib/curseforge'
import { getPack } from '../../../lib/token'
import validate from '../../../lib/validate'

const handler = validate(
   {
      body: {
         name: Joi.string().required(),
      },
   },
   async (req, res, session) => {

      if (req.method === 'POST') {

         if (!session.user) throw new ApiError(403, 'Pack creation requires user')

         const pack = await Pack.create({ ...req.body, author: session.user.email })

         return res.json(pack)
      }

      if (req.method === 'PUT') {

         const { id } = await getPack(session)

         const { name, author, description, links } = req.body
         const mods = await getMods(req.body)

         await Pack.findByIdAndUpdate(id, { name, mods, author, description, links })

         return res.status(204).end()
      }

      res.status(400).send({ error: 'Invalid method' })
   }
)

export default handler
