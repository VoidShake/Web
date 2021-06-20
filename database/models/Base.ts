import { ObjectID } from "mongodb";

export default interface Model {
   id: string
   _id: ObjectID
}