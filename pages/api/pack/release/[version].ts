import Joi from 'joi'
import Release from '../../../../database/models/Release'
import { getMods } from '../../../../lib/curseforge'
import { getPack } from '../../../../lib/token'
import validate from '../../../../lib/validate'

const handler = validate(
   {
      query: {
         version: Joi.string().required(),
      },
      body: {
         installedAddons: Joi.array().required(),
         name: Joi.string().optional(),
         version: Joi.string().required(),
         date: Joi.string().required(),
         url: Joi.string().required(),
         changelog: Joi.string().required(),
      },
   },
   async (req, res, session) => {
      const { version } = req.query

      const { id } = await getPack(session)

      if (req.method === 'PUT') {

         const { installedAddons, ...release } = req.body
         const mods = await getMods({ installedAddons })

         await Release.create({
            ...release, mods,
            pack: id,
         })

         console.log('Received data for', version)

         return res.status(204).end()
      }

      res.status(400).send({ error: 'Invalid method' })
   }
)

export default handler
