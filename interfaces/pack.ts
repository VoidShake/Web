import IMod from "./mod";
import IPage from "./page";

export default interface IPack {
   _id: string
   name: string
   slug: string
   mods: IMod[]
   pages?: IPage[]
}