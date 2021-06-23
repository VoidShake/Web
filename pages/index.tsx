import styled from '@emotion/styled'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'
import { invert } from 'polished'
import { FC } from 'react'
import Layout from '../components/Layout'
import Link from '../components/Link'
import Title from '../components/Title'
import database, { serialize } from '../database'
import Pack, { IPack } from '../database/models/Pack'

const Page: FC<{ packs: Partial<IPack>[] }> = ({ packs }) => (
   <Layout>
      <Title>Browse packs</Title>

      <List>
         {packs.map(pack => (
            <Link key={pack.id} href={`/${pack.slug}`}>
               <li>
                  <img alt={pack.name} src={pack.assets?.icon} />
                  <h2>{pack.name}</h2>
               </li>
            </Link>
         ))}
      </List>
   </Layout>
)

const List = styled.ul`
   display: grid;
   grid-template-columns: repeat(auto-fill, 300px);
   justify-content: center;

   li {
      text-align: center;
      cursor: pointer;
      padding: 1rem;

      transition: all 0.1s linear;
      &:hover {
         background: ${p => p.theme.secondary};
         color: ${p => invert(p.theme.text)};
      }
   }
`

export const getServerSideProps: GetServerSideProps = async ctx => {
   await database()
   const session = await getSession({ ctx })
   const rawPacks = await Pack.find({ $or: [{ author: session?.user?.email }, { private: false }] })
   return { props: { packs: rawPacks.map(serialize) } }
}

export default Page
