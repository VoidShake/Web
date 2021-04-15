import IAddon from "./interfaces/mod"
import IPack from "./interfaces/pack"

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

export async function getMods(pack: IPack) {

   const addons: Array<Partial<IAddon> & { id: number }> = pack.installedAddons
      .filter(a => a.installedFile.categorySectionPackageType !== 3)
      .map(({ addonID }) => ({
         id: addonID,
         library: pack.installedAddons.some(a => a.installedFile.dependencies.some(d => d.addonId === addonID))
      }))

   const mods: IAddon[] = await Promise.all(addons.map(async a => {
      const { attachments, primaryCategoryId, categories, ...mod } = await getMod(a.id)

      const libIds = [421, 425, 423, 435]

      return {
         ...a, ...mod,
         library: !!(a.library && [421, 425].includes(primaryCategoryId) && categories.every(c => libIds.includes(c.categoryId))),
         icon: attachments.find(a => a.isDefault)?.thumbnailUrl
      }
   }))

   const sorted = mods.sort((a, b) => {
      const [ia, ib] = [a, b].map(x => x.library ? 100000000000 : 0)
      return (ia - ib) + (b.popularityScore - a.popularityScore)
   })

   return sorted

}