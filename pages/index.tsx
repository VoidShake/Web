import styled from '@emotion/styled'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { FC } from 'react'
import Layout from '../components/Layout'
import Title from '../components/Title'
import database, { serialize } from '../database'
import Pack, { IPack } from '../database/models/Pack'

const Home: FC<{ packs: Partial<IPack>[] }> = ({ packs }) => (
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
         background: #ddd;
         color: black;
      }
   }
`

export const getServerSideProps: GetServerSideProps = async () => {
   await database()
   const rawPacks = await Pack.find()
   return { props: { packs: rawPacks.map(serialize) } }
}

export default Home
