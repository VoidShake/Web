import styled from '@emotion/styled'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { FC } from 'react'
import Layout from '../../components/Layout'
import Modlist from '../../components/Modlist'
import Title from '../../components/Title'
import database from '../../database'
import IMod from '../../interfaces/mod'
import IPack from '../../interfaces/pack'

const PackView: FC<{
   mods: IMod[]
   name: string
   pages: Array<{
      link: string
      title: string
   }>
}> = ({ mods, name, pages }) => {

   return (
      <Layout title={name}>

         <Title>{name}</Title>

         {pages.length > 0 &&
            <Pages>
               <p>Read about specific aspects of the pack</p>
               <ul>
                  {pages.map(({ link, title }) =>
                     <Link key={link} href={link}>
                        <li>
                           {title}
                        </li>
                     </Link>
                  )}
               </ul>
            </Pages>
         }

         <Modlist mods={mods} />

      </Layout>
   )
}

const Pages = styled.ul`
   margin: 3rem 0;
   text-align: center;

   p {
      font-style: italic;
   }
   
   ul {
      display: grid;
      grid-auto-flow: column;
      list-style: none;
      justify-content: center;
      gap: 2rem;
      font-size: 2rem;
      padding: 0.6rem;

      li {
         padding: 0.4rem 0.8rem;
         position: relative;
         transition: all 0.1s linear;

         &:hover {
            background: #DDD;
            color: black;
            cursor: pointer;
         }

         /*
         &::after {
            content: '';
            background: #FFF2;
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            pointer-events: none;
            clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
            transition: clip-path 0.1s linear;
         }

         &:hover::after {
            clip-path: polygon(5% 0, 100% 0, 95% 100%, 0% 100%);
         }
         */

      }
   }

   a {
      text-decoration: none;
      color: #EEE;
   }
`

/*
export const getStaticPaths: GetStaticPaths = async () => {

  const { db } = await database()
  const packs: IPack[] = await db.collection('packs').find().toArray()

  const paths = packs.map(({ name }) => ({
    params: { pack: name }
  }))

  return { paths, fallback: false }
}
*/

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
      { $project: { _id: false } }
   ]).toArray()

   if (!pack) return { notFound: true }

   const pages = pack.pages?.map(({ slug, title }) => ({
      title,
      link: `/${pack.slug}/${slug}`
   })) ?? []

   return { props: { ...pack, pages } }

}

export default PackView