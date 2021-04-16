export default interface IMod {
   id: number
   name: string
   library: boolean
   websiteUrl?: string
   summary?: string
   icon?: string
   popularityScore: number
   categories: Array<{
      categoryId: number
      name: string,
      url: string
      avatarUrl: string
   }>
}