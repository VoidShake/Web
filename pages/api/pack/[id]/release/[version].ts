import Joi from 'joi'
import Release from '../../../../../database/models/Release'
import { getMods } from '../../../../../lib/curseforge'
import { authorizedPack } from '../../../../../lib/token'
import validate from '../../../../../lib/validate'
import withSession from '../../../../../lib/wrapper'

export default withSession(async (req, res, session) => {
   const { version } = req.query

   validate(req, {
      query: {
         id: Joi.string().required(),
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
   })

   const id = req.query.id as string
   await authorizedPack(session, id)

   console.log(`creating release for pack with ID '${id}'`)

   const { installedAddons, ...release } = req.body
   const mods = await getMods({ installedAddons })

   await Release.create({
      ...release,
      mods,
      pack: id,
   })

   console.log('successfully created release with version', version)

   return res.status(204).end()
})
