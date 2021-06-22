import Joi from 'joi'
import { parse } from 'path'
import Pack from '../../../../../database/models/Pack'
import parseFiles from '../../../../../lib/requestFiles'
import { save } from '../../../../../lib/storage'
import { authorizedPack } from '../../../../../lib/token'
import validate from '../../../../../lib/validate'
import withSession, { forMethod } from '../../../../../lib/wrapper'

export default forMethod(
   'put',
   withSession(async (req, res, session) => {
      validate(req, {
         query: {
            id: Joi.string().required(),
         },
      })

      const id = req.query.id as string
      await authorizedPack(session, id)

      const files = await parseFiles(req)

      const assets = Object.entries(files).reduce((o, [path, f]) => {
         const file = Array.isArray(f) ? f[0] : f
         const { name } = parse(path)
         save(file, 'packs', id.toString(), path)
         return { ...o, [name]: `/api/pack/${id}/assets/${path}` }
      }, {})

      await Pack.findByIdAndUpdate(id, { assets }, { upsert: true })
      res.status(200).json({ assets })
   })
)

export const config = {
   api: {
      bodyParser: false,
   },
}
