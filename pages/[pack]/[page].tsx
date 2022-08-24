import styled from '@emotion/styled'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { FC, ReactNode, useMemo } from 'react'
import Layout from '../../components/Layout'
import ModCard from '../../components/ModCard'
import { Grid } from '../../components/Modlist'
import Title from '../../components/Title'
import database, { serialize } from '../../database'
import { IMod } from '../../database/models/Mod'
import Pack from '../../database/models/Pack'
import Page, { IPage, Relevance } from '../../database/models/Page'
import Release from '../../database/models/Release'

const DocuPage: FC<
   IPage<IMod> & {
      pack: {
         name: string
         link: string
      }
   }
> = ({ title, content = [], mods, pack }) => {
   const fewMods = mods.length < 3 && content.length > 0

   return (
      <Layout title={`${pack.name} - ${title}`}>
         <Title subtitle={pack}>{title}</Title>

         {!fewMods && (
            <Grid>
               {mods.map(mod => (
                  <ModCard key={mod.slug} {...mod} />
               ))}
            </Grid>
         )}

         {content.map(({ text, image }, i) => (
            <Panel key={i} right={i % 2 !== 0}>
               {i === 0 && fewMods && (
                  <Grid>
                     {mods.map(mod => (
                        <ModCard key={mod.slug} {...mod} />
                     ))}
                  </Grid>
               )}

               {text && (
                  <div>
                     {text.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                     ))}
                  </div>
               )}

               {image && <img src={image} />}
            </Panel>
         ))}
      </Layout>
   )
}

const Panel: FC<{ right?: boolean; children: ReactNode[] }> = ({ right, children }) => {
   const sorted = useMemo(() => (right ? [...children].reverse() : children), [right, children])
   return <Split>{sorted}</Split>
}

const Split = styled.div<{ right?: boolean }>`
   display: grid;
   grid-auto-flow: column;
   max-width: 1200px;
   margin: 0 auto;
   gap: 3rem;

   div {
      p:not(:last-of-type) {
         margin-bottom: 1rem;
      }
   }

   & > {
      max-width: 800px;
   }
`

export const getServerSideProps: GetServerSideProps = async ctx => {
   await database()
   const session = await getSession({ ctx })

   const pack = await Pack.findOne({ slug: ctx.params?.pack })
   if (!pack) return { notFound: true }

   const page = await Page.findOne({ pack: pack._id, slug: ctx.params?.page })
   if (!page) return { notFound: true }

   if (pack.private && pack.author !== session?.user?.email) return { notFound: true }

   if (!pack) return { notFound: true }
   const release = await Release.findOne({ pack: pack._id })

   const mods = (release?.toJSON()?.mods ?? []).map(mod => ({ ...mod, relevance: page.mods.find(m => m.slug === mod.slug)?.relevance })).filter(mod => !!mod.relevance)

   mods.sort((a, b) => {
      const [ra, rb] = [a, b].map(x => Object.values(Relevance).indexOf(x.relevance ?? Relevance.MINOR))
      return ra - rb
   })

   return {
      props: {
         ...serialize(page),
         mods: serialize(mods),
         pack: {
            name: pack.name,
            link: `/${pack.slug}`,
         },
      },
   }
}

export default DocuPage
