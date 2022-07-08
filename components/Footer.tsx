import styled from '@emotion/styled'
import { useSession } from 'next-auth/react'
import { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import Link from './Link'

const Footer: FC = () => {
   const { data: session } = useSession()

   return (
      <Style>
         {session?.user ? (
            <p>
               <Link underline='hover' href='/profile'>
                  <FormattedMessage defaultMessage='Logged in as {name}' values={session.user} />
               </Link>
            </p>
         ) : (
            <Link href='/api/auth/signin'>
               <FormattedMessage defaultMessage='Login' />
            </Link>
         )}
      </Style>
   )
}

const Style = styled.footer`
   position: absolute;
   bottom: 0;
   padding: 0.7rem;
`

export default Footer
