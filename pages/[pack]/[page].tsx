import styled from '@emotion/styled'
import { GetServerSideProps } from 'next'
import { FC, ReactNode, useMemo } from 'react'
import Layout from '../../components/Layout'
import Title from '../../components/Title'
import database from '../../database'
import IPage from '../../interfaces/page'

const PackView: FC<IPage> = ({ title, content }) => {

   return (
      <Layout title={title}>

         <Title>{title}</Title>

         {content.map(({ text, image }, i) =>
            <Panel right={i % 2 !== 0}>
               {text &&
                  <p>
                     {text.split('\n').map((line, i) =>
                        <p key={i}>{line}</p>)
                     }
                  </p>
               }
               {image && <img src={image} />}
            </Panel>
         )}

      </Layout>
   )
}

const Panel: FC<{ right?: boolean, children: ReactNode[] }> = ({ right, children }) => {
   const sorted = useMemo(() => right ? [...children].reverse() : children, [right, children])
   return <Split>{sorted}</Split>
}

const Split = styled.div<{ right?: boolean }>`
   display: grid;
   grid-template-columns: repeat(auto-fill, 1fr);
   max-width: 1200px;
   margin: 0 auto;
   gap: 3rem;

   p {
      p:not(:last-of-type) {
         margin-bottom: 1rem;
      }
   }

   & > {
      max-width: 800px;
   }
`

export const getServerSideProps: GetServerSideProps = async ({ params }) => {

   const { db } = await database()

   const [page] = await db.collection<IPage>('pages').aggregate([
      {
         $match: { slug: params?.page.toString(), }
      },
      {
         $lookup: {
            from: 'packs',
            localField: 'pack',
            foreignField: '_id',
            as: 'pack'
         }
      },
      {
         $addFields: {
            Pack: {
               $arrayElemAt: [
                  {
                     $filter: {
                        input: '$Pack',
                        as: 'pack',
                        cond: {
                           $eq: ['$$pack.slug', params?.pack]
                        }
                     }
                  }, 0
               ]
            }
         }
      },
      {
         $project: { _id: false }
      }
   ]).toArray()

   if (!page) return { notFound: true }

   return { props: page }

}

export default PackView