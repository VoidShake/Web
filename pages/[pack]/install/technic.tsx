import { GetServerSideProps } from 'next'
import { FC } from 'react'
import Layout from '../../../components/Layout'
import Title from '../../../components/Title'
import database from '../../../database'
import IPack from '../../../interfaces/pack'

const PackView: FC<IPack> = ({ name, assets, description, links }) => {
   return (
      <Layout title={name} image={assets.icon} description={description}>

         <Title>Install using Technic</Title>

         {links.technic}

      </Layout>
   )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
   const { db } = await database()

   const [pack] = await db
      .collection<IPack>('packs')
      .aggregate([
         {
            $project: {
               name: true,
               slug: true,
               links: true,
               assets: true,
               description: true
            }
         },
         { $match: { slug: params?.pack } },
      ])
      .toArray()

   if (!pack) return { notFound: true }

   return { props: pack }
}

export default PackView
