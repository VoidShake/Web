import { jsx } from '@emotion/react';
import styled from '@emotion/styled';
import { StyledIcon } from '@styled-icons/styled-icon';
import { FC, HTMLAttributes } from 'react';
import Line from './Line';
import Link from './Link';

const H1 = styled.h1`
   text-align: center;
   font-size: 4rem;
   margin: 1rem auto;
   width: fit-content;
`

const Subtitle = styled.p`
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
      icon?: StyledIcon
      noline?: boolean
      subtitle?: {
         name: string
         link: string
      }
   }
> = ({ children, subtitle, noline, icon, ...props }) => (
   <>
      {subtitle && (
         <Subtitle>
            <Link href={subtitle.link}>
               {subtitle.name}
            </Link>
         </Subtitle>
      )}

      <H1 {...props}>
         {children}
         {icon && jsx(icon, { size: 40 })}
      </H1>

      <Line invisible={noline} />
   </>
)

export default Title
