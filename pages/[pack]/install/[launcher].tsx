import { GetServerSideProps } from 'next'
import { FC } from 'react'
import Layout from '../../../components/Layout'
import Title from '../../../components/Title'
import database from '../../../database'
import IPack from '../../../interfaces/pack'

const PackView: FC<{
   pack: {
      name: string
      description?: string
      assets: IPack['assets']
   }
}> = ({ pack }) => {
   return (
      <Layout title={pack.name} image={pack.assets.icon} description={pack.description}>
         <Title>Installation</Title>
      </Layout>
   )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
   const { db } = await database()

   const [pack] = await db
      .collection<IPack>('packs')
      .aggregate([
         { $project: { _id: false } },
         { $match: { slug: params?.pack } },
         {
            $lookup: {
               from: 'pages',
               localField: '_id',
               foreignField: 'pack',
               as: 'pages',
            },
         },
      ])
      .toArray()

   if (!pack) return { notFound: true }

   return { props: { pack } }
}

export default PackView
