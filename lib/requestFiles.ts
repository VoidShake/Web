import Form from 'formidable';
import { NextApiRequest } from "next";
import { getDir } from './storage';

export default function parseFiles(req: NextApiRequest) {
   return new Promise<Form.Files>((res, rej) => {

      const form = new Form({ multiples: true, uploadDir: getDir('temp') })
      
      form.parse(req, (err, _, files) => {
         if (err) rej(err)
         else res(files)
      })

   })
}