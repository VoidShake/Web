import type { NextApiHandler } from 'next'
import slugify from 'slugify'
import database from '../../../database'

const handler: NextApiHandler = async (req, res) => {

   const { db } = await database()

   if (req.method === 'PUT') {
      const slug = slugify(req.body.title, { lower: true })
      const { pack } = req.body
      const result = await db.collection('pages').updateOne({ slug, pack }, { $set: { ...req.body, slug } }, { upsert: true })
      return res.json(result)
   }

   res.status(400).send({ error: 'Invalid method' })

}

export default handler