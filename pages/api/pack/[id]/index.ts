import Joi from 'joi'
import slugify from 'slugify'
import Pack from '../../../../database/models/Pack'
import { getMods } from '../../../../lib/curseforge'
import validate from '../../../../lib/validate'

const handler = validate(
   {
      query: {
         id: Joi.string().required(),
      },
      body: {
         name: Joi.string().required(),
         installedAddons: Joi.array().required(),
      },
   },
   async (req, res) => {
      const { id } = req.query

      if (req.method === 'PUT') {

         const { name, author, description, links } = req.body
         const slug = slugify(name, { lower: true })
         const mods = await getMods(req.body)

         const values = { name, mods, slug, author, description, links }

         await Pack.findByIdAndUpdate(id, {
            $set: values,
            //$push: { releases: { release } }
         }, { upsert: true })
         
         return res.status(204).end()
      }

      res.status(400).send({ error: 'Invalid method' })
   }
)

export default handler
