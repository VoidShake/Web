export interface ModReference {
   slug: string
   relevance: Relevance
}

export enum Relevance {
   MAJOR = 'major',
   MINOR = 'minor',
}

export default interface IPage<M = ModReference> {
   slug: string
   pack: string
   title: string
   mods: Array<M & ModReference>
   content: Array<{
      text?: string
      image?: string
   }>
}