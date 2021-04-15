import { GetStaticProps } from 'next'
import Link from 'next/link'
import { FC } from 'react'
import Layout from '../components/Layout'
import database from '../database'
import IPack from '../interfaces/pack'

const Home: FC<{ packs: IPack[] }> = ({ packs }) => (
  <Layout>
    <h1>Browse packs</h1>
    {packs.map(pack =>
      <Link key={pack._id} href={`/${pack.name}`}>{pack.name}</Link>
    )}
  </Layout>
)

export const getStaticProps: GetStaticProps = async () => {

  const { db } = await database()
  const packs = await db.collection('packs').find().toArray()

  return { props: { packs: JSON.parse(JSON.stringify(packs)) } }

}

export default Home
