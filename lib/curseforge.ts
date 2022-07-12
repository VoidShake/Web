import { IMod } from '../database/models/Mod'

const BASE_URL = 'https://api.curseforge.com/v1'
const { CURSEFORGE_TOKEN } = process.env

interface RawMod {
   logo?: {
      thumbnailUrl: string
      url: string
   }
   primaryCategoryId: number
   categories: IMod['categories']
   name: string
   slug: string
   gamePopularityRank: number
}

interface RawPack {
   installedAddons: {
      addonID: number
      installedFile: {
         fileDate: string
         /** @deprecated use `fileName` */
         displayName?: string
         fileName: string
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

export async function getMod(id: number) {
   const response = await fetch(`${BASE_URL}/mods/${id}`, {
      headers: {
         'x-api-key': CURSEFORGE_TOKEN!,
      },
   })

   const { data } = (await response.json()) as { data: RawMod }
   return data
}

export async function getMods(pack: RawPack) {
   const addons = pack.installedAddons
      .filter(a => a.installedFile.modules.some(m => m.foldername === 'META-INF'))
      .map(({ addonID, installedFile }) => ({
         cfID: addonID,
         version: {
            date: installedFile.fileDate,
            file: installedFile.fileName ?? installedFile.displayName,
         },
         library: pack.installedAddons.some(a => a.installedFile.dependencies.some(d => d.addonId === addonID)),
      }))

   return Promise.all(
      addons.map<Promise<IMod>>(async a => {
         const { logo, primaryCategoryId, categories, gamePopularityRank, ...mod } = await getMod(a.cfID)

         const libIds = [421, 425, 423, 435]

         return {
            ...a,
            ...mod,
            categories,
            library: !!(a.library && [421, 425].includes(primaryCategoryId) && categories.every(c => libIds.includes(c.id))),
            popularityScore: gamePopularityRank,
            icon: logo?.thumbnailUrl,
         }
      })
   )
}
