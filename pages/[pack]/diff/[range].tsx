import styled from '@emotion/styled'
import { ArrowRight } from '@styled-icons/fa-solid'
import { groupBy } from 'lodash'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { FC, useCallback, useMemo } from 'react'
import Layout from '../../../components/Layout'
import MinifiedList from '../../../components/MinifiedList'
import ModLine, { Change, ChangeStyle, getChange, VersionedMod } from '../../../components/ModLine'
import Select from '../../../components/Select'
import { Center } from '../../../components/Text'
import Title from '../../../components/Title'
import database, { serialize } from '../../../database'
import Pack, { IPack } from '../../../database/models/Pack'
import Release, { IRelease } from '../../../database/models/Release'

const Diff: FC<{
   from: IRelease
   to: IRelease
   pack: IPack
   versions: string[]
}> = ({ from, to, pack, versions }) => {
   const router = useRouter()

   const mods = useMemo(() => {

      const added = to.mods
         .filter(m1 => !from.mods.some(m2 => m2.cfID === m1.cfID))
         .map<VersionedMod>(m => ({ ...m, to: m.version }))

      const changed = from.mods.map<VersionedMod>(mod => ({
         ...mod, from: mod.version,
         to: to.mods.find(m => m.cfID === mod.cfID)?.version,
      }))

      return [...changed, ...added]

   }, [from, to])

   const lists = useMemo(() =>
      Object.entries(groupBy(mods, m => getChange(m)))
         .map(([c, l]) => [Number.parseInt(c), l] as [Change, VersionedMod[]]),
      [mods]
   )

   const select = useCallback((h: { from?: string, to?: string }) =>
      router.push(`/${pack.slug}/diff/${h.from ?? from.version}..${h.to ?? to.version}`),
      [from, to]
   )

   return (
      <Layout title={`Comparison ${from.version} > ${to.version}`}>

         <Title noline subtitle={{ ...pack, link: `/${pack.slug}` }}>
            Comparing
            <Versions>
               <Select value={from.version} values={versions} onChange={from => select({ from })} />
               <ArrowRight size='1rem' />
               <Select value={to.version} values={versions} onChange={to => select({ to })} />
            </Versions>
         </Title>

         {from.version === to.version &&
            <Center as='h3'>Select two different versions</Center>
         }

         <Stats>
            {lists.map(([change, list]) =>
               <Stat change={change} key={change}>
                  {list.length} mod{list.length === 1 ? '' : 's'} {Change[change]}
               </Stat>
            )}
         </Stats>

         {lists.map(([change, list]) =>
            <MinifiedList
               object={`${Change[change]} mod`}
               minified={change === Change.unchanged}
               toggleable={change === Change.unchanged}
               key={change}>
               {list.map(mod =>
                  <ModLine key={mod.cfID} {...mod} />
               )}
            </MinifiedList>
         )}

      </Layout>
   )
}

const Stats = styled.div`
   display: grid;
   grid-auto-flow: column;
   grid-auto-columns: 1fr;
   justify-content: center;
   gap: 2rem;
   width: max-content;
   margin: 3rem auto;
`

const Stat = styled.span<{ change: Change }>`
   padding: 1rem;
   text-align: center;
   ${ChangeStyle};
`

const Versions = styled.p`
   display: grid;
   grid-auto-flow: column;
   justify-content: center;
   align-items: center;
   gap: 1rem;
   padding: 1rem 0;
   font-size: 2rem;
`

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
   await database()

   const versions = params?.range.toString().split('..') ?? []

   const pack = await Pack.findOne({ slug: params?.pack as string })
   if (!pack) return { notFound: true }

   const releases = await Release.find({ pack: pack._id }, { version: true }, { sort: { date: -1 } })

   const [from, to] = await Promise.all<IRelease>(versions
      .map(it => it?.toString())
      .map(version => Release.findOne({ version, pack: pack._id }).then(r => serialize(r))))

   if (!from || !to) return { notFound: true }

   return {
      props: {
         from, to,
         pack: serialize(pack),
         versions: releases.map(it => it.version),
      },
   }
}

export default Diff
