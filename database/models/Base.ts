import { ObjectId } from 'bson'

export default interface Model {
   id: string
   _id: ObjectId
}
