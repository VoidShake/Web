import styled from '@emotion/styled'
import Link from 'next/link'
import { FC, HTMLAttributes } from 'react'
import Line from './Line'

const H1 = styled.h1`
   text-align: center;
   font-size: 4rem;
   margin: 1rem 0;
`

const Crumbs = styled.p`
   margin-bottom: -1rem;
   padding-top: 0;
   text-align: center;

   a {
      font-size: 1.5rem;
      text-decoration: none;
      color: #eee;
   }

   &:hover {
      text-decoration: underline;
   }
`

const Title: FC<
   HTMLAttributes<HTMLHeadingElement> & {
      noline?: boolean
      crumbs?: Array<{
         name: string
         link: string
      }>
   }
> = ({ children, crumbs, noline, ...props }) => (
   <>
      {crumbs?.length && (
         <Crumbs>
            {crumbs.map(c => (
               <Link key={c.link} href={c.link}>
                  {c.name}
               </Link>
            ))}
         </Crumbs>
      )}

      <H1 {...props}>{children}</H1>

      <Line invisible={noline} />
   </>
)

export default Title
