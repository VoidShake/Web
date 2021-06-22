import Joi from 'joi'
import slugify from 'slugify'
import Page, { Relevance } from '../../../../database/models/Page'
import { authorizedPack } from '../../../../lib/token'
import validate from '../../../../lib/validate'
import withSession, { forMethod } from '../../../../lib/wrapper'

export default forMethod(
   'put',
   withSession(async (req, res, session) => {
      validate(req, {
         query: {
            id: Joi.string().required(),
         },
         body: {
            title: Joi.string().required(),
            mods: Joi.array().items(
               Joi.alternatives(
                  Joi.string(),
                  Joi.object({
                     slug: Joi.string().required(),
                     relevance: Joi.string().allow(...Object.values(Relevance)),
                  })
               )
            ),
            content: Joi.array()
               .items(
                  Joi.object({
                     text: Joi.string(),
                     image: Joi.string(),
                  })
               )
               .required(),
         },
      })

      const id = req.query.id as string
      await authorizedPack(session, id)

      const slug = slugify(req.body.title, { lower: true })

      const mods = req.body.mods.map((m: unknown) => (typeof m === 'object' ? m : { slug: m, relevance: Relevance.MINOR }))

      await Page.updateOne({ slug, pack: id }, { ...req.body, slug, mods }, { upsert: true })

      res.status(204).end()
   })
)
