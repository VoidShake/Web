import IMod from "../interfaces/mod"

const BASE_URL = 'https://addons-ecs.forgesvc.net/api/v2'

interface RawMod {
   attachments: Array<{
      isDefault: boolean
      thumbnailUrl: string
      url: string
   }>
   primaryCategoryId: number
   categories: IMod['categories']
   name: string
   popularityScore: number
}

interface RawPack {
   name: string
   slug: string
   installedAddons: {
      addonID: number
      installedFile: {
         displayName: string
         categorySectionPackageType: number
         dependencies: Array<{
            addonId: number
         }>
         modules: Array<{
            foldername: string

         }>
      }
   }[]
}

export function getMod(id: number): Promise<RawMod> {
   return fetch(`${BASE_URL}/addon/${id}`).then(r => r.json())
}

export async function getMods(pack: RawPack) {

   const addons: Array<Partial<IMod> & { id: number }> = pack.installedAddons
      .filter(a => a.installedFile.modules.some(m => m.foldername === 'META-INF'))
      .map(({ addonID }) => ({
         id: addonID,
         library: pack.installedAddons.some(a => a.installedFile.dependencies.some(d => d.addonId === addonID))
      }))

   const mods: IMod[] = await Promise.all(addons.map(async a => {
      const { attachments, primaryCategoryId, categories, ...mod } = await getMod(a.id)

      const libIds = [421, 425, 423, 435]

      return {
         ...a, ...mod,
         categories,
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