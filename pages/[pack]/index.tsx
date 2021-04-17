import { GetServerSideProps } from 'next'
import { FC, useMemo, useState } from 'react'
import Layout from '../../components/Layout'
import Modlist from '../../components/Modlist'
import Pages, { LinkPage } from '../../components/Pages'
import Title from '../../components/Title'
import database from '../../database'
import IMod from '../../interfaces/mod'
import IPack from '../../interfaces/pack'

const PackView: FC<{
   mods: IMod[]
   name: string
   pages: LinkPage[]
   assets: IPack['assets']
}> = ({ name, assets, ...props }) => {

   const [hoveredMod, setHoveredMod] = useState<IMod>()
   const [hoveredPage, setHoveredPage] = useState<string>()

   const pages = useMemo(() => props.pages.map(page => ({
      ...page, highlight: hoveredMod?.pages?.some(p => p.slug === page.slug)
   })), [props.pages, hoveredMod])

   const mods = useMemo(() => props.mods.map(mod => ({
      ...mod, highlight: mod.pages?.some(p => p.slug === hoveredPage)
   })), [props.mods, hoveredPage])

   return (
      <Layout title={name} image={assets.icon}>

         <Title>{name}</Title>

         {pages.length > 0 && <Pages pages={pages} onHover={setHoveredPage} />}

         <Modlist mods={mods} onHover={setHoveredMod} />

      </Layout>
   )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {

   const { db } = await database()

   const [pack] = await db.collection<IPack>('packs').aggregate([
      { $match: { slug: params?.pack } },
      {
         $lookup: {
            from: 'pages',
            localField: '_id',
            foreignField: 'pack',
            as: 'pages'
         }
      },
      { $unwind: '$mods' },
      {
         $lookup: {
            from: 'pages',
            let: {
               slug: '$mods.slug',
            },
            pipeline: [
               {
                  $match: {
                     $expr: {
                        $in: ['$$slug', '$mods.slug']
                     }
                  }
               },
               { $project: { _id: false } },
            ],
            as: 'mods.pages',
         }
      },
      {
         $group: {
            _id: '$_id',
            mods: { $push: '$mods' },
            pages: { $first: '$pages' },
            name: { $first: '$name' },
            assets: { $first: '$assets' },
            slug: { $first: '$slug' },
         }
      }
   ]).toArray()

   if (!pack) return { notFound: true }

   const pages = pack.pages?.map(({ slug, title }) => ({
      title, slug,
      link: `/${pack.slug}/${slug}`
   })) ?? []

   return { props: { ...pack, pages } }

}

export default PackView