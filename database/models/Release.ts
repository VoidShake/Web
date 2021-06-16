import { ObjectId } from "mongodb";
import Mongoose, { Schema } from "mongoose";
import { define } from "..";
import Model from "./Base";
import Mod, { IMod } from "./Mod";

export interface IRelease extends Model {
   pack: ObjectId
   name?: string
   version: string
   date: string
   url: string
   changelog: string
   mods: IMod[]
}

const schema = new Schema({
   pack: Mongoose.Types.ObjectId,
   name: String,
   version: {
      type: String,
      required: true,
   },
   date: {
      type: String,
      required: true,
   },
   url: {
      type: String,
      required: true,
   },
   changelog: {
      type: String,
      required: true,
   },
   mods: [Mod],
})

schema.index({ pack: 1, version: -1 }, { unique: true })

export default define<IRelease>('Release', schema)