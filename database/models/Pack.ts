import { Schema } from "mongoose";
import slugify from "slugify";
import { define } from "../index";
import Model from "./Base";
import Mod, { IMod } from "./Mod";
import { IPage } from "./Page";
import Release, { IRelease } from "./Release";

export interface IPack extends Model {
   name: string
   description: string
   slug: string
   mods: IMod[]
   pages?: IPage[]
   assets: Record<string, string | undefined>
   links: Record<string, string | undefined>
   releases?: IRelease[]
}

const schema = new Schema({
   name: {
      type: String,
      required: true,
      unique: true,
   },
   description: String,
   slug: String,
   mods: [Mod],
   assets: Schema.Types.Mixed,
   links: Schema.Types.Mixed,
   releases: [Release],
})

schema.pre('save', async function (this: IPack) {
   this.slug = slugify(this.name, { lower: true })
})

export default define<IPack>('Pack', schema)