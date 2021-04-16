import styled from '@emotion/styled'
import { GetServerSideProps } from 'next'
import { FC, ReactNode, useMemo } from 'react'
import Layout from '../../components/Layout'
import ModCard from '../../components/ModCard'
import { Grid } from '../../components/Modlist'
import Title from '../../components/Title'
import database from '../../database'
import IMod from '../../interfaces/mod'
import IPack from '../../interfaces/pack'
import IPage, { Relevance } from '../../interfaces/page'

const Page: FC<IPage<IMod>> = ({ title, content, mods }) => {

   return (
      <Layout title={title}>

         <Title>{title}</Title>

         <Grid>
            {mods.map(mod => <ModCard key={mod.slug} {...mod} />)}
         </Grid>

         {content.map(({ text, image }, i) =>
            <Panel key={i} right={i % 2 !== 0}>
               {text && <div>
                  {text.split('\n').map((line, i) =>
                     <p key={i}>{line}</p>)
                  }
               </div>}
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

   const [{ pack: [pack], ...page }] = await db.collection<IPage & { pack: IPack[] }>('pages').aggregate([
      { $project: { _id: false } },
      { $match: { slug: params?.page.toString(), } },
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
   ]).toArray()

   if (!page || !pack) return { notFound: true }

   const unsorted = pack.mods
      .map(mod => ({ ...mod, relevance: undefined, ...page.mods.find(m => m.slug === mod.slug) }))
      .filter(mod => !!mod.relevance)

   const mods = unsorted.sort((a, b) => {
      const [ra, rb] = [a, b].map(x => Object.values(Relevance).indexOf(x.relevance ?? Relevance.MINOR))
      return ra - rb;
   })

   return { props: { ...page, mods, pack: pack._id.toString() } }

}

export default Page