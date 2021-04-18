import styled from '@emotion/styled'
import { Download } from '@styled-icons/fa-solid'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { FC, useMemo, useState } from 'react'
import Background from '../../components/Background'
import Layout from '../../components/Layout'
import Line from '../../components/Line'
import Modlist from '../../components/Modlist'
import Pages, { LinkPage } from '../../components/Pages'
import Title from '../../components/Title'
import database from '../../database'
import IMod from '../../interfaces/mod'
import IPack from '../../interfaces/pack'

const PackView: FC<{
   mods: IMod[]
   name: string
   slug: string
   description?: string
   assets: IPack['assets']
   links: IPack['links']
   pages: LinkPage[]
}> = ({ name, assets, description, slug, links, ...props }) => {
   const [hoveredMod, setHoveredMod] = useState<IMod>()
   const [hoveredPage, setHoveredPage] = useState<string>()

   const pages = useMemo(
      () =>
         props.pages.map(page => ({
            ...page,
            highlight: hoveredMod?.pages?.some(p => p.slug === page.slug),
         })),
      [props.pages, hoveredMod]
   )

   const mods = useMemo(
      () =>
         props.mods.map(mod => ({
            ...mod,
            highlight: mod.pages?.some(p => p.slug === hoveredPage),
         })),
      [props.mods, hoveredPage]
   )

   const [download] = Object.entries(links)

   return (
      <Layout title={name} image={assets.icon} description={description}>
         <Background src={assets.background} />

         <Title noline>
            {name}
            <Link href={`/${slug}/install/${download[0]}`}>
               <Links>Download <Download size={20} /></Links>
            </Link>
         </Title>


         {description?.split('\n').map((line, i) => (
            <Description key={i}>{line}</Description>
         ))}

         {pages.length > 0 && <Pages pages={pages} onHover={setHoveredPage} />}

         <Line invisible />

         <Modlist mods={mods} onHover={setHoveredMod} />
      </Layout>
   )
}

const Links = styled.h2`
   font-size: 1.5rem;
   text-align: center;
   cursor: pointer;

   &:hover {
      text-decoration: underline;
   }

   svg {
      margin-left: 0.3rem;
   }
`

const Description = styled.p`
   text-align: center;
   max-width: 1200px;
   margin: 0 auto;
`

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
   const { db } = await database()

   const [pack] = await db
      .collection<IPack>('packs')
      .aggregate([
         { $match: { slug: params?.pack } },
         {
            $lookup: {
               from: 'pages',
               localField: '_id',
               foreignField: 'pack',
               as: 'pages',
            },
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
                           $in: ['$$slug', '$mods.slug'],
                        },
                     },
                  },
                  { $project: { _id: false } },
               ],
               as: 'mods.pages',
            },
         },
         {
            $group: {
               _id: '$_id',
               mods: { $push: '$mods' },
               pages: { $first: '$pages' },
               name: { $first: '$name' },
               description: { $first: '$description' },
               assets: { $first: '$assets' },
               links: { $first: '$links' },
               slug: { $first: '$slug' },
            },
         },
      ])
      .toArray()

   if (!pack) return { notFound: true }

   const pages =
      pack.pages?.map(({ slug, title }) => ({
         title,
         slug,
         link: `/${pack.slug}/${slug}`,
      })) ?? []

   return { props: { ...pack, pages } }
}

export default PackView
