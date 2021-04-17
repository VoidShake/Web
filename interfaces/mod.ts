import IPage from './page'

export default interface IMod {
   id: number
   name: string
   library: boolean
   websiteUrl?: string
   summary?: string
   slug: string
   icon?: string
   popularityScore: number
   highlight?: boolean
   fade?: boolean
   categories: Array<{
      categoryId: number
      name: string
      url: string
      avatarUrl: string
   }>
   pages?: Array<IPage>
}
