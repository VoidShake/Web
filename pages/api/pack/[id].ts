import Joi from 'joi'
import slugify from 'slugify'
import database from '../../../database'
import { getMods } from '../../../lib/curseforge'
import validate from '../../../lib/validate'

const handler = validate({
   body: {
      name: Joi.string().required(),
      installedAddons: Joi.array().required(),
   }
}, async (req, res) => {
   const { id } = req.query

   const { db } = await database()

   if (req.method === 'PUT') {
      const { name, author } = req.body
      const slug = slugify(name, { lower: true })
      const mods = await getMods(req.body)
      await db.collection('packs').updateOne({ _id: id }, { $set: { name, mods, slug, author } }, { upsert: true })
      return res.status(204).end()
   }

   res.status(400).send({ error: 'Invalid method' })

})

export default handler