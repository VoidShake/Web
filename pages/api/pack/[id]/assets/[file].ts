import { NextApiHandler } from 'next'
import { sendFile } from '../../../../../lib/storage'

const handler: NextApiHandler = async (req, res) => {
   const { id, file } = req.query

   if (req.method === 'GET') {
      return sendFile(res, 'packs', id?.toString(), file?.toString())
   }

   res.status(400).send({ error: 'Invalid method' })
}

export default handler
