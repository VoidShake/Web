export default interface IPage {
   slug: string
   pack: string
   title: string
   content: Array<{
      text?: string
      image?: string
   }>
}