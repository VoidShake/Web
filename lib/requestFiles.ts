import Form from 'formidable';
import { NextApiRequest } from "next";

export default function parseFiles(req: NextApiRequest) {
   return new Promise<Form.Files>((res, rej) => {

      const form = new Form({ multiples: true })
      form.parse(req, (err, _, files) => {
         if (err) rej(err)
         else res(files)
      })

   })
}