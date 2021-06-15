import { Schema } from "mongoose";
import Model from "./Base";

export interface IRelease extends Model {
   name?: string
   version: string
   date: string
   url: string
   changelog: string
}

const schema = new Schema({
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
})

export default schema