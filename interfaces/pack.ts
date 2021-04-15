export default interface IPack {
   _id: string
   name: string
   slug: string
   installedAddons: {
      addonID: number
      installedFile: {
         displayName: string
         categorySectionPackageType: number
         dependencies: {
            addonId: number
         }[]
      }
   }[]
}