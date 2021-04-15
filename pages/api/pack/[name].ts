import type { NextApiHandler } from 'next'
import database from '../../../database'

const handler: NextApiHandler = async (req, res) => {
   const { name } = req.query

   const { db } = await database()

   if (req.method === 'PUT') {
      const result = await db.collection('packs').updateOne({ name }, { $set: { ...req.body, name } }, { upsert: true })
      return res.json(result)
   }

   res.status(400).send({ error: 'Invalid method' })

}

export default handler