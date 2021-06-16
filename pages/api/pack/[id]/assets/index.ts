import Joi from 'joi'
import { parse } from 'path'
import Pack from '../../../../../database/models/Pack'
import parseFiles from '../../../../../lib/requestFiles'
import { save } from '../../../../../lib/storage'
import validate from '../../../../../lib/validate'

const handler = validate(
   {
      query: {
         id: Joi.string().required(),
      },
   },
   async (req, res) => {
      const { id } = req.query


      if (req.method === 'PUT') {
         const files = await parseFiles(req)

         const assets = Object.entries(files).reduce((o, [path, f]) => {
            const file = Array.isArray(f) ? f[0] : f
            const { name } = parse(path)
            save(file, 'packs', id.toString(), path)
            return { ...o, [name]: `/api/pack/${id}/assets/${path}` }
         }, {})

         await Pack.findByIdAndUpdate(id, { assets }, { upsert: true })
         return res.status(200).json({ assets })
      }

      res.status(400).send({ error: 'Invalid method' })
   }
)

export const config = {
   api: {
      bodyParser: false,
   },
}

export default handler
