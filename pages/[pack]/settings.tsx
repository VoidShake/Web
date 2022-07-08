import styled from '@emotion/styled'
import { Eye, Lock } from '@styled-icons/fa-solid'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { invert } from 'polished'
import { createElement, FC, useReducer, useState } from 'react'
import Button, { ButtonStyle } from '../../components/Button'
import Cell from '../../components/Cell'
import Copy from '../../components/Copy'
import BaseForm from '../../components/Form'
import useSubmit from '../../components/hooks/useSubmit'
import Input, { Textarea } from '../../components/Input'
import Layout from '../../components/Layout'
import Title from '../../components/Title'
import database, { serialize } from '../../database'
import Pack, { IPack } from '../../database/models/Pack'
import { createToken } from '../../lib/token'

const Page: FC<
   IPack & {
      token: string
   }
> = ({ slug, assets, token, id, ...current }) => {
   const router = useRouter()

   const [name, setName] = useState(current.name)
   const [description, setDescription] = useState(current.description)
   const [priv, togglePrivate] = useReducer(b => !b, current.private ?? false)

   const [save] = useSubmit<IPack>(`pack/${id}`, { name, description, private: priv }, 'PUT', p => {
      if (p.slug !== slug) router.push(`/${p.slug}/settings`)
   })

   return (
      <Layout title={current.name} image={assets?.icon} description={current.description}>
         <Title subtitle={{ link: `/${slug}`, ...current }}>Settings</Title>

         <Style>
            <Copy content={token}>Copy Token</Copy>

            <Form onSubmit={save}>
               <Toggle active={priv} onClick={togglePrivate}>
                  {priv ? 'Private' : 'Public'}
                  {createElement(priv ? Lock : Eye, { size: '1.5rem' })}
               </Toggle>

               <Cell area='name'>
                  <label htmlFor='name'>Name</label>
                  <Input id='name' value={name} onChange={setName} />
               </Cell>

               <Cell area='desc'>
                  <label htmlFor='description'>Description</label>
                  <Textarea id='description' value={description} onChange={setDescription} />
               </Cell>

               <Button>Save</Button>
            </Form>
         </Style>
      </Layout>
   )
}

const Toggle = styled.button<{ active: boolean }>`
   ${ButtonStyle};

   padding: 1rem 0;
   background: ${p => (p.active ? invert(p.theme.text) : p.theme.secondary)};
   color: ${p => (p.active ? p.theme.secondary : invert(p.theme.text))};
`

const Style = styled.section`
   display: grid;
   justify-content: center;
   gap: 2rem;
   font-size: 2rem;
`

const Form = styled(BaseForm)`
   width: 90vw;
   max-width: 800px;

   grid-template:
      'name private'
      'desc desc'
      'save save'
      / 2fr 1fr;

   ${Button} {
      grid-area: save;
   }

   ${Toggle} {
      grid-area: private;
   }

   textarea {
      height: 400px;
   }
`

export const getServerSideProps: GetServerSideProps = async ctx => {
   await database()

   const pack = await Pack.findOne({ slug: ctx.query?.pack?.toString() })

   const session = await getSession({ ctx })

   if (!pack) return { notFound: true }
   if (pack.author !== session?.user?.email) return { notFound: true }

   const token = createToken(pack.id)

   return { props: { ...serialize(pack), token } }
}

export default Page
