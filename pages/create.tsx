import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'
import Button from '../components/Button'
import FormStyle from '../components/Form'
import useSubmit from '../components/hooks/useSubmit'
import Input from '../components/Input'
import Layout from '../components/Layout'
import Title from '../components/Title'
import { IPack } from '../database/models/Pack'

const Page: FC = () => {
   const [session] = useSession()

   return (
      <Layout>
         <Title>Create pack</Title>

         {session ? <Form /> : <p>You need to logged in to create a pack</p>}
      </Layout>
   )
}

const Form: FC = () => {
   const [name, setName] = useState('')
   const router = useRouter()

   const [submit] = useSubmit<IPack>('pack', { name }, 'POST', p => router.push(`/${p.slug}`))

   return (
      <FormStyle onSubmit={submit}>
         <Input required placeholder='Name' value={name} onChange={setName} />
         <Button>Create</Button>
      </FormStyle>
   )
}

export default Page
