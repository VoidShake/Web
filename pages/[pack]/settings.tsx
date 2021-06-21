import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'
import { FC, useCallback } from 'react'
import Layout from '../../components/Layout'
import Title from '../../components/Title'
import database, { serialize } from '../../database'
import Pack, { IPack } from '../../database/models/Pack'
import { createToken, isAuthorized } from '../../lib/token'

const PackSettings: FC<IPack & {
   token: string
}> = ({ name, description, slug, assets, token }) => {

   const copyToken = useCallback(() => {
      navigator.clipboard.writeText(token)
   }, [token])

   return (
      <Layout title={name} image={assets?.icon} description={description}>

         <Title subtitle={{ link: `/${slug}`, name }}>Settings</Title>

         <button onClick={copyToken}>Copy token</button>

      </Layout>
   )
}

export const getServerSideProps: GetServerSideProps = async ctx => {
   await database()

   const pack = await Pack.findOne({ slug: ctx.query?.pack?.toString() })

   const session = await getSession({ ctx })

   if (!pack) return { notFound: true }
   if (!await isAuthorized(session, pack.id)) return { notFound: true }

   const token = createToken(pack.id)

   return { props: { ...serialize(pack), token } }
}

export default PackSettings
