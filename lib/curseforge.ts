import { IMod } from "../database/models/Mod"

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
   slug: string
   popularityScore: number
}

interface RawPack {
   installedAddons: {
      addonID: number
      installedFile: {
         fileDate: string
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

export async function getMods(pack: RawPack): Promise<IMod[]> {
   const addons = pack.installedAddons
      .filter(a => a.installedFile.modules.some(m => m.foldername === 'META-INF'))
      .map(({ addonID, installedFile }) => ({
         cfID: addonID,
         version: {
            date: installedFile.fileDate,
            file: installedFile.displayName,
         },
         library: pack.installedAddons.some(a => a.installedFile.dependencies.some(d => d.addonId === addonID)),
      }))

   return Promise.all(
      addons.map(async a => {
         const { attachments, primaryCategoryId, categories, ...mod } = await getMod(a.cfID)

         const libIds = [421, 425, 423, 435]

         return {
            ...a,
            ...mod,
            categories,
            library: !!(a.library && [421, 425].includes(primaryCategoryId) && categories.every(c => libIds.includes(c.categoryId))),
            icon: attachments.find(a => a.isDefault)?.thumbnailUrl,
         }
      })
   )
}
