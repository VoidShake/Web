import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'
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

         {session
            ? <Form />
            : <p>You need to logged in to create a pack</p>
         }

      </Layout>
   )
}

const Form: FC = () => {
   const [name, setName] = useState('')
   const router = useRouter()

   const [submit] = useSubmit<IPack>('pack', { name }, 'POST', p => router.push(`/${p.slug}`))

   return (
      <form onSubmit={submit}>
         <Input required placeholder='Name' value={name} onChange={setName} />
         <button>Create</button>
      </form>
   )
}


/*
export const getServerSideProps: GetServerSideProps = async () => {
   await database()
   const rawPacks = await Pack.find()
   return { props: { packs: rawPacks.map(serialize) } }
}
*/

export default Page
