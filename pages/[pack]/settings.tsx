import { GetServerSideProps } from 'next'
import { FC, useCallback } from 'react'
import Layout from '../../components/Layout'
import Title from '../../components/Title'
import database, { serialize } from '../../database'
import Pack, { IPack } from '../../database/models/Pack'
import { createToken } from '../../lib/token'

const PackSettings: FC<IPack & {
   token: string
}> = ({ name, description, slug, assets = {}, token }) => {

   const copyToken = useCallback(() => {
      navigator.clipboard.writeText(token)
   }, [token])

   return (
      <Layout title={name} image={assets.icon} description={description}>

         <Title subtitle={{ link: `/${slug}`, name }}>Settings</Title>

         <button onClick={copyToken}>Copy token</button>

      </Layout>
   )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
   await database()

   const pack = await Pack.findOne({ slug: query?.pack?.toString() })

   if (!pack) return { notFound: true }

   const token = createToken(pack.id)

   return { props: { ...serialize(pack), token } }
}

export default PackSettings
