import { readFileSync } from 'fs'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { FC } from 'react'
import Layout from '../components/Layout'
import database from '../database'
import IPack from '../interfaces/pack'

const Home: FC<{
  packs: {
    name: string
    id: string
    slug: string
  }[]
}> = ({ packs }) => (
  <Layout>
    <h1>Browse packs</h1>
    {packs.map(pack =>
      <Link key={pack.id} href={`/${pack.slug}`}>{pack.name}</Link>
    )}
  </Layout>
)

export const getServerSideProps: GetServerSideProps = async () => {

  const { db } = await database()
  const rawPacks = await db.collection<IPack>('packs').find().toArray()

  if (process.env.NODE_ENV === 'development') {
    const manifest = readFileSync('C:\\Users\\nik\\curseforge\\minecraft\\Instances\\Steampunk & Dragons\\minecraftinstance.json').toString()

    fetch('http://localhost:3001/api/pack/6078155abe092d123f201ee9', {
      body: manifest,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  const packs = rawPacks.map(pack => ({
    id: pack._id.toString(),
    name: pack.name,
    slug: pack.slug,
  }))

  return { props: { packs } }

}

export default Home
