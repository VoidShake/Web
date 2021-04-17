import Joi from 'joi'
import { sendFile } from '../../../../../lib/storage'
import validate from '../../../../../lib/validate'

const handler = validate({
   query: {
      id: Joi.string().required(),
      file: Joi.string().required(),
   }
}, async (req, res) => {
   const { id, file } = req.query

   if (req.method === 'GET') {

      return sendFile(res,  'packs', id.toString(), file.toString())      

   }

   res.status(400).send({ error: 'Invalid method' })

})

export default handler