import Joi from 'joi'
import { sendFile } from '../../../../../lib/storage'
import validate from '../../../../../lib/validate'
import { forMethod } from '../../../../../lib/wrapper'

export default forMethod('get', async (req, res) => {
   validate(req, {
      query: {
         id: Joi.string().required(),
         file: Joi.string().required(),
      },
   })

   const { id, file } = req.query as Record<string, string>

   return sendFile(res, 'packs', id, file)
})
