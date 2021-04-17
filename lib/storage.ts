import { File } from 'formidable'
import { createReadStream, existsSync, mkdirSync, renameSync, statSync } from 'fs'
import { NextApiResponse } from 'next'
import { extname, join } from 'path'

const STORAGE_PATH = process.env.STORAGE_PATH ?? 'storage'

export function getDir(...location: string[]) {
   const dir = join(STORAGE_PATH, ...location)
   if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
   return dir
}

export function getPath(...path: string[]) {
   const [name, ...dir] = [...path].reverse()
   return join(getDir(...dir.reverse()), name)
}

export function exists(...location: string[]) {
   const path = getPath(...location)
   return existsSync(path)
}

export function save(file: File, ...location: string[]) {
   const path = getPath(...location)
   renameSync(file.path, path)
   return path
}

export function sendFile(res: NextApiResponse, ...location: string[]) {
   const path = getPath(...location)
   const ext = extname(path).substring(1)
   const { size } = statSync(path)

   res.writeHead(200, {
      'Content-Type': `application/${ext}`,
      'Content-Length': size,
   })

   createReadStream(path).pipe(res)
}
