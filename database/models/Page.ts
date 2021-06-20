import Mongoose, { Schema } from "mongoose";
import { define } from "..";
import Model from "./Base";

export interface ModReference {
   slug: string
   relevance: Relevance
}

export enum Relevance {
   MAJOR = 'major',
   MINOR = 'minor',
}

export interface IPage<M = ModReference> extends Model {
   slug: string
   pack: string
   title: string
   mods: Array<M & ModReference>
   content: Array<{
      text?: string
      image?: string
   }>
}

const schema = new Schema({
   pack: {
      type: Mongoose.Types.ObjectId,
      required: true,
   },
   slug: String,
   title: {
      type: String,
      required: true,
   },
   mods: [new Schema({
      slug: { type: String, required: true },
      relevance: { type: String, required: true },
   })],
   context: [new Schema({
      text: String,
      image: String,
   })]
})

export default define<IPage>('Page', schema)