import { Db, MongoClient } from 'mongodb'

interface DB {
   client: MongoClient
   db: Db
}

declare global {
   namespace NodeJS {
      interface Global {
         mongo: {
            conn?: DB
            promise?: Promise<DB>
         }
      }
   }
}
