import type { NextApiHandler } from 'next'
import slugify from 'slugify'
import database from '../../../database'

const handler: NextApiHandler = async (req, res) => {
   const { id } = req.query

   const { db } = await database()

   if (req.method === 'PUT') {
      const slug = slugify(req.body.name, { lower: true })
      const result = await db.collection('packs').updateOne({ _id: id }, { $set: { ...req.body, slug } }, { upsert: true })
      return res.json(result)
   }

   res.status(400).send({ error: 'Invalid method' })

}

export default handler