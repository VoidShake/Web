import Joi from 'joi'
import Release from '../../../../../database/models/Release'
import { authorizedPack } from '../../../../../lib/token'
import validate from '../../../../../lib/validate'
import withSession from '../../../../../lib/wrapper'

const modSchema = Joi.object({
   id: Joi.string(),
   name: Joi.string(),
   library: Joi.boolean().optional(),
   websiteUrl: Joi.string().optional(),
   summary: Joi.string().optional(),
   slug: Joi.string(),
   icon: Joi.string().optional(),
   popularityScore: Joi.number().optional(),
   categories: Joi.array().items(Joi.string()).unique().optional(),

   version: Joi.string().optional(),
})

export default withSession(async (req, res, session) => {
   const { version } = req.query

   validate(req, {
      query: {
         id: Joi.string().required(),
         version: Joi.string().required(),
      },
      body: {
         mods: Joi.array().items(modSchema).required(),
         name: Joi.string().optional(),
         version: Joi.string().required(),
         date: Joi.string().required(),
         url: Joi.string(),
         changelog: Joi.string().required(),
      },
   })

   const id = req.query.id as string
   await authorizedPack(session, id)

   console.log(`creating release for pack with ID '${id}'`)

   const { mods, ...release } = req.body

   await Release.create({
      ...release,
      mods,
      pack: id,
   })

   console.log('successfully created release with version', version)

   return res.status(204).end()
})
