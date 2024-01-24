import Joi from 'joi'
import { authorizedPack } from '../../../../lib/token'
import validate from '../../../../lib/validate'
import withSession, { methodSwitch } from '../../../../lib/wrapper'

const put = withSession(async (req, res, session) => {
   validate(req, {
      query: {
         id: Joi.string().required(),
      },
      body: {
         name: Joi.string(),
         description: Joi.string(),
         links: Joi.object().pattern(/^/, Joi.string()),
         private: Joi.boolean(),
      },
   })

   const id = req.query.id as string
   const pack = await authorizedPack(session, id)

   Object.assign(pack, req.body)
   const updated = await pack.save()
   
   console.log(`Updated pack '${updated.name}'`)

   return res.json(updated)
})

const get = withSession(async (req, res, session) => {
   validate(req, {
      query: {
         id: Joi.string().required(),
      },
   })

   const id = req.query.id as string
   const pack = await authorizedPack(session, id, ['name', 'author', 'description', 'slug', 'assets', 'links', 'private'])
   res.json(pack)
})

export default methodSwitch({ put, get })
