import styled from '@emotion/styled'
import { useSession } from 'next-auth/client'
import React, { FC } from 'react'
import Link from './Link'

const Footer: FC = () => {
   const [session] = useSession()

   return <Style>
      {session
         ? <p>Logged in as <b>{session.user?.name}</b></p>
         : <Link href='/api/auth/signin'>Login</Link>
      }
   </Style>
}

const Style = styled.footer`
   position: absolute;
   bottom: 0;
   padding: 0.7rem;
`

export default Footer