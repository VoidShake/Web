import { Schema } from 'mongoose'
import { IPage } from './Page'

export interface IMod {
   id: string
   name: string
   /**
    * @deprecated
    */
   library?: boolean
   websiteUrl?: string
   summary?: string
   slug: string
   icon?: string
   popularityScore?: number
   categories: string[]
   version?: string
   pages?: Array<IPage>
}

const schema = new Schema({
   id: {
      type: String,
      required: true,
   },
   name: {
      type: String,
      required: true,
   },
   library: Boolean,
   websiteUrl: String,
   wikiUrl: String,
   issuesUrl: String,
   sourceUrl: String,
   summary: String,
   slug: {
      type: String,
      required: true,
   },
   icon: String,
   popularityScore: Number,
   categories: [{ type: String, required: false }],
   version: String,
})

export default schema
