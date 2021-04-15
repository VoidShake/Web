const BASE_URL = 'https://addons-ecs.forgesvc.net/api/v2'

interface Mod {
   attachments: Array<{
      isDefault: boolean
      thumbnailUrl: string
      url: string
   }>
   primaryCategoryId: number
   categories: Array<{
      categoryId: number
   }>
   name: string
   popularityScore: number
}

export function getMod(id: number): Promise<Mod> {
   return fetch(`${BASE_URL}/addon/${id}`).then(r => r.json())
}