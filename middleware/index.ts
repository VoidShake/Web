
import bodyParser from 'body-parser'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

const json = bodyParser.json()
const urlencoded = bodyParser.urlencoded({ extended: true })

function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: typeof json) {
   return new Promise((resolve, reject) => {
      fn(req, res, result => {
         if (result instanceof Error) return reject(result)
         else return resolve(result)
      })
   })
}

const middleware: NextApiHandler = async (req, res) => {


}

export default middleware