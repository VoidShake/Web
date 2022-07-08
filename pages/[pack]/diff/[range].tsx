import styled from '@emotion/styled'
import { ArrowRight } from '@styled-icons/fa-solid'
import { groupBy } from 'lodash'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { darken } from 'polished'
import { FC, useCallback, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import Layout from '../../../components/Layout'
import Line from '../../../components/Line'
import MinifiedList from '../../../components/MinifiedList'
import ModLine, { Change, ChangeStyle, getChange, VersionedMod } from '../../../components/ModLine'
import Select from '../../../components/Select'
import { Center } from '../../../components/Text'
import Title from '../../../components/Title'
import database, { serialize } from '../../../database'
import Pack, { IPack } from '../../../database/models/Pack'
import Release, { IRelease } from '../../../database/models/Release'

const Page: FC<{
   from: IRelease
   to: IRelease
   pack: IPack
   versions: string[]
   changes: Array<{ changelog: string; version: string }>
}> = ({ from, to, pack, versions, changes }) => {
   const router = useRouter()

   const mods = useMemo(() => {
      const added = to.mods
         .filter(m1 => !from.mods.some(m2 => m2.cfID === m1.cfID))
         .map<VersionedMod>(m => ({ ...m, to: m.version }))

      const changed = from.mods.map<VersionedMod>(mod => ({
         ...mod,
         from: mod.version,
         to: to.mods.find(m => m.cfID === mod.cfID)?.version,
      }))

      return [...changed, ...added]
   }, [from, to])

   const lists = useMemo(() => Object.entries(groupBy(mods, m => getChange(m))).map(([c, l]) => [Number.parseInt(c), l] as [Change, VersionedMod[]]), [mods])

   const select = useCallback((h: { from?: string; to?: string }) => router.push(`/${pack.slug}/diff/${h.from ?? from.version}..${h.to ?? to.version}`), [from, to])

   return (
      <Layout title={`Comparison ${from.version} > ${to.version}`}>
         <Title subtitle={{ ...pack, link: `/${pack.slug}` }}>
            Comparing
            <Versions>
               <Select value={from.version} values={versions} onChange={from => select({ from })} />
               <ArrowRight size='1rem' />
               <Select value={to.version} values={versions} onChange={to => select({ to })} />
            </Versions>
         </Title>

         {from.version === to.version && <Center as='h3'>Select two different versions</Center>}

         <Changes>
            {changes.map(({ changelog, version }) => (
               <div key={version}>
                  {changelog.split('\n').map((line, i) => (
                     <p key={`${version}-${i}`}>{line}</p>
                  ))}
               </div>
            ))}
         </Changes>

         <Line />

         <Stats>
            {lists.map(([change, list]) => (
               <Stat change={change} key={change}>
                  <FormattedMessage defaultMessage='{count, plural, one {mod} other {# mods} }' values={{ count: list.length }} /> {Change[change]}
               </Stat>
            ))}
         </Stats>

         {lists.map(([change, list]) => (
            <MinifiedList object={`${Change[change]} mod`} minified={change === Change.unchanged} toggleable={change === Change.unchanged} key={change}>
               {list.map(mod => (
                  <ModLine key={mod.cfID} {...mod} />
               ))}
            </MinifiedList>
         ))}
      </Layout>
   )
}

const Changes = styled.div`
   gap: 1rem;
   padding: 1rem 100px;

   display: flex;
   flex-direction: column;
   flex-wrap: wrap;

   max-height: 600px;
   width: fit-content;

   > div {
      padding: 1rem 1.5rem;
      background: ${p => darken(p.theme.darker, p.theme.bg)};
      max-width: 600px;
   }
`

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

export const getServerSideProps: GetServerSideProps = async ctx => {
   const { params } = ctx

   await database()
   const session = await getSession({ ctx })

   const versions = params?.range.toString().split('..') ?? []

   const pack = await Pack.findOne({ slug: params?.pack as string, $or: [{ author: session?.user?.email }, { private: false }] })
   if (!pack) return { notFound: true }

   const releases = await Release.find({ pack: pack._id }, { version: true }, { sort: { date: -1 } })

   const matches = await Promise.all(versions.map(v => Release.findOne({ pack: pack._id, version: v === 'current' ? { $exists: true } : v }, undefined, { sort: { date: -1 } })))

   if (matches.length === 1 && matches[0]) {
      matches.unshift(await Release.findOne({ pack: pack._id, date: { $lt: matches[0].date } }, undefined, { sort: { date: -1 } }))
   }

   const [from, to] = matches.map<IRelease>(serialize)

   if (!from || !to) return { notFound: true }

   const changes = await Release.find({ pack: pack._id, date: { $gte: from.date, $lt: to.date } }, { changelog: true, version: true }, { sort: { date: -1 } })

   return {
      props: {
         from,
         to,
         pack: serialize(pack),
         changes: serialize(changes),
         versions: releases.map(it => it.version),
      },
   }
}

export default Page
