import styled from '@emotion/styled'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'
import Button from '../../components/Button'
import Copy from '../../components/Copy'
import BaseForm from '../../components/Form'
import useSubmit from '../../components/hooks/useSubmit'
import Input, { Textarea } from '../../components/Input'
import Layout from '../../components/Layout'
import Title from '../../components/Title'
import database, { serialize } from '../../database'
import Pack, { IPack } from '../../database/models/Pack'
import { createToken, getAuthorizedPack } from '../../lib/token'

const Page: FC<
   IPack & {
      token: string
   }
> = ({ slug, assets, token, id, ...current }) => {
   const router = useRouter()

   const [name, setName] = useState(current.name)
   const [description, setDescription] = useState(current.description)

   const [save] = useSubmit<IPack>(`pack/${id}`, { name, description }, 'PUT', p => {
      if (p.slug !== slug) router.push(`/${p.slug}/settings`)
   })

   return (
      <Layout title={current.name} image={assets?.icon} description={current.description}>
         <Title subtitle={{ link: `/${slug}`, ...current }}>Settings</Title>

         <Form onSubmit={save}>

            <Copy content={token}>Copy Token</Copy>

            <label htmlFor='name'>Name</label>
            <Input id='name' value={name} onChange={setName} />

            <label htmlFor='description'>Description</label>
            <Textarea id='description' value={description} onChange={setDescription} />

            <Button>Save</Button>

         </Form>

      </Layout>
   )
}

const Form = styled(BaseForm)`
   width: 90vw;
   max-width: 800px;

   textarea {
      height: 400px;
   }
`

export const getServerSideProps: GetServerSideProps = async ctx => {
   await database()

   const pack = await Pack.findOne({ slug: ctx.query?.pack?.toString() })

   const session = await getSession({ ctx })

   if (!pack) return { notFound: true }
   if (!(await getAuthorizedPack(session, pack.id))) return { notFound: true }

   const token = createToken(pack.id)

   return { props: { ...serialize(pack), token } }
}

export default Page
