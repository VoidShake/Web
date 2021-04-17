import styled from '@emotion/styled'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { FC } from 'react'
import Layout from '../components/Layout'
import Title from '../components/Title'
import database from '../database'
import IPack from '../interfaces/pack'

const Home: FC<{ packs: Partial<IPack>[] }> = ({ packs }) => (
   <Layout>
      <Title>Browse packs</Title>

      <List>
         {packs.map(pack => (
            <Link key={pack._id} href={`/${pack.slug}`}>
               <Pack>
                  <img alt={pack.name} src={pack.assets?.icon} />
                  <h2>{pack.name}</h2>
               </Pack>
            </Link>
         ))}
      </List>
   </Layout>
)

const List = styled.ul`
   display: grid;
   grid-template-columns: repeat(auto-fill, 300px);
   justify-content: center;
`

const Pack = styled.li`
   text-align: center;
   cursor: pointer;
   padding: 1rem;

   transition: all 0.1s linear;
   &:hover {
      background: #ddd;
      color: black;
   }
`

export const getServerSideProps: GetServerSideProps = async () => {
   const { db } = await database()
   const rawPacks = await db.collection<IPack>('packs').find().toArray()

   const packs = rawPacks.map(pack => ({
      _id: pack._id.toString(),
      name: pack.name,
      slug: pack.slug,
      assets: pack.assets,
   }))

   return { props: { packs } }
}

export default Home
