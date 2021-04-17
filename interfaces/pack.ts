import IMod from './mod'
import IPage from './page'

export default interface IPack {
   _id: string
   name: string
   description: string
   slug: string
   mods: IMod[]
   pages?: IPage[]
   assets: Record<string, string | undefined>
   links: Record<string, string | undefined>
}
