import { Schema } from "mongoose";
import slugify from "slugify";
import { define } from "../index";
import Model from "./Base";
import { IPage } from "./Page";

export interface IPack extends Model {
   name: string
   description: string
   slug: string
   pages?: IPage[]
   assets: Record<string, string | undefined>
   links: Record<string, string | undefined>
}

const schema = new Schema({
   name: {
      type: String,
      required: true,
      unique: true,
   },
   description: String,
   slug: String,
   assets: Schema.Types.Mixed,
   links: Schema.Types.Mixed,
})

schema.pre('save', async function (this: IPack) {
   this.slug = slugify(this.name, { lower: true })
})

export default define<IPack>('Pack', schema)