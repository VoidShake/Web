import Joi from 'joi'
import slugify from 'slugify'
import Page, { Relevance } from '../../../database/models/Page'
import validate from '../../../lib/validate'

const handler = validate(
   {
      body: {
         title: Joi.string().required(),
         pack: Joi.string().required(),
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
   },
   async (req, res) => {

      if (req.method === 'PUT') {
         const slug = slugify(req.body.title, { lower: true })
         const { pack } = req.body

         const mods = req.body.mods.map((m: unknown) => (typeof m === 'object' ? m : { slug: m, relevance: Relevance.MINOR }))

         await Page.updateOne({ slug, pack }, { ...req.body, slug, mods }, { upsert: true })
         
         return res.status(204).end()
      }

      res.status(400).send({ error: 'Invalid method' })
   }
)

export default handler
