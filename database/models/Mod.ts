import { Schema } from 'mongoose'
import { IPage } from './Page'

export interface IMod {
   cfID: number
   name: string
   library: boolean
   websiteUrl?: string
   summary?: string
   slug: string
   icon?: string
   popularityScore?: number
   highlight?: boolean
   fade?: boolean
   categories: Array<{
      categoryId: number
      name: string
      url: string
      avatarUrl: string
   }>
   version: {
      date: string
      file: string
   }
   pages?: Array<IPage>
}

const schema = new Schema({
   cfID: {
      type: Number,
      required: true,
   },
   name: {
      type: String,
      required: true,
   },
   library: {
      type: Boolean,
      required: true,
   },
   websiteUrl: String,
   summary: String,
   slug: {
      type: String,
      required: true,
   },
   icon: String,
   popularityScore: Number,
   categories: [
      new Schema({
         categoryId: { type: Number, required: true },
         name: { type: String, required: true },
         url: { type: String, required: true },
         avatarUrl: { type: String, required: true },
      }),
   ],
   version: new Schema({
      date: { type: String, required: true },
      file: { type: String, required: true },
   }),
})

export default schema
