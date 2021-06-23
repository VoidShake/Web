import { Schema } from 'mongoose'
import slugify from 'slugify'
import { define } from '../index'
import Model from './Base'

export interface IPack extends Model {
   name: string
   author: string
   description: string
   slug: string
   assets?: Record<string, string | undefined>
   links?: Record<string, string | undefined>
   private: boolean
}

const schema = new Schema({
   name: {
      type: String,
      required: true,
      unique: true,
   },
   author: {
      type: String,
      required: true,
   },
   description: String,
   slug: String,
   assets: Schema.Types.Mixed,
   links: Schema.Types.Mixed,
   private: {
      type: Boolean,
      default: false
   }
})

schema.pre('save', async function (this: IPack) {
   this.slug = slugify(this.name, { lower: true })
})

export default define<IPack>('Pack', schema)
