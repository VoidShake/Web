import Joi from 'joi'
import slugify from 'slugify'
import database from '../../../database'
import validate from '../../../lib/validate'

const handler = validate({
   body: {
      title: Joi.string().required(),
      pack: Joi.string().required(),
      content: Joi.array().items(Joi.object({
         text: Joi.string(),
         image: Joi.string(),
      })).required(),
   }
}, async (req, res) => {

   const { db } = await database()

   if (req.method === 'PUT') {
      const slug = slugify(req.body.title, { lower: true })
      const { pack } = req.body
      await db.collection('pages').updateOne({ slug, pack }, { $set: { ...req.body, slug } }, { upsert: true })
      return res.status(204).end()
   }

   res.status(400).send({ error: 'Invalid method' })

})

export default handler