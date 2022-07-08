import styled from '@emotion/styled'
import { Moon, Sun } from '@styled-icons/fa-solid'
import { Session } from 'next-auth'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { invert } from 'polished'
import { createElement, FC, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkButton as Link } from '../components/Button'
import useSettings from '../components/hooks/useSettings'
import useTooltip from '../components/hooks/useTooltip'
import Layout from '../components/Layout'
import Title from '../components/Title'

const Page: FC = () => {
   const { data: session, status } = useSession()
   const router = useRouter()

   useEffect(() => {
      if (status === 'unauthenticated') router.push('/api/auth/signin')
   }, [router, status])

   return (
      <Layout>
         <Title>
            <FormattedMessage defaultMessage='Profile' />
         </Title>

         {session?.user ? <Profile {...session.user} /> : <p>You are not logged in</p>}
      </Layout>
   )
}

const Profile: FC<Session['user']> = ({ name, email, image }) => {
   const [{ dark }, modify] = useSettings()
   const tooltip = useTooltip('profile')

   return (
      <Style>
         {tooltip}
         <img src={image} alt={name} />

         <h2>{name}</h2>
         <p>{email}</p>

         <Buttons>
            <button data-for='profile' data-tip={`Use ${dark ? 'light' : 'dark'} mode`} onClick={() => modify({ dark: !dark })}>
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
   display: grid;
   justify-content: center;
   width: fit-content;
   margin: 0 auto;

   column-gap: 100px;
   row-gap: 1rem;
   text-align: center;

   ${Link} {
      grid-area: logout;
   }

   grid-template:
      'icon name buttons'
      'icon email buttons'
      'icon . buttons'
      'icon logout buttons'
      / 1fr auto 1fr;

   img {
      clip-path: circle(50% at 50% 50%);
      grid-area: icon;
      width: 300px;
      max-width: 20vw;
   }
`

export default Page
