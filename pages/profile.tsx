import styled from '@emotion/styled'
import { Moon, Sun } from '@styled-icons/fa-solid'
import { Session } from 'next-auth'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { invert } from 'polished'
import { createElement, FC, useEffect } from 'react'
import useSettings from '../components/hooks/useSettings'
import Layout from '../components/Layout'
import Link from '../components/LinkButton'
import Title from '../components/Title'

const Page: FC = () => {
   const [session, loading] = useSession()
   const router = useRouter()

   useEffect(() => {
      if (!session?.user && !loading) router.push('/api/auth/signin')
   }, [session, router, loading])

   return (
      <Layout>
         <Title>Profile</Title>

         {session?.user
            ? <Profile {...session.user} />
            : <p>You are not logged in</p>
         }

      </Layout>
   )
}

const Profile: FC<Session['user']> = ({ name, email, image }) => {
   const [{ dark }, modify] = useSettings()

   return (
      <Style>
         <img src={image} alt={name} />

         <h2>{name}</h2>
         <p>{email}</p>

         <Buttons>
            <button onClick={() => modify({ dark: !dark })}>
               {createElement(dark ? Sun : Moon, { size: '2rem' })}
            </button>
         </Buttons>

         <Link href='/api/auth/signout'>Logout</Link>

      </Style>
   )
}

const Buttons = styled.ul`
   grid-area: buttons;

   button {
      border-radius: 9999px;
      background: ${p => p.theme.secondary};
      color: ${p => invert(p.theme.text)};
      padding: 0.7rem;
   }
`

const Style = styled.section`
   margin-left: -500px;
   display: grid;
   justify-content: center;

   column-gap: 100px;
   row-gap: 1rem;
   text-align: center;

   ${Link} {
      grid-area: logout;
   }

   grid-template: 
      "icon name buttons"
      "icon email buttons"
      "icon . buttons"
      "icon logout buttons";

   img {
      clip-path: circle(50% at 50% 50%);
      grid-area: icon;
      width: 400px;
      max-width: 20vw;
   }
`

/*
export const getServerSideProps: GetServerSideProps = async () => {
   await database()
   const rawPacks = await Pack.find()
   return { props: { packs: rawPacks.map(serialize) } }
}
*/

export default Page
