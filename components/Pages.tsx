import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { } from 'lodash'
import { invert, mix } from 'polished'
import { FC } from 'react'
import Link from '../components/Link'

export interface LinkPage {
   link: string
   title: string
   slug: string
   highlight?: boolean
}

const Pages: FC<{
   pages: LinkPage[]
   onHover?: (slug?: string) => void
}> = ({ pages, onHover }) => {
   return (
      <List>
         <p>Read about specific aspects of the pack</p>
         <ul>
            {pages.map(({ link, title, highlight, slug }) => (
               <Link key={link} href={link}>
                  <Page highlight={highlight} onMouseOver={() => onHover?.(slug)} onMouseLeave={() => onHover?.()}>
                     {title}
                  </Page>
               </Link>
            ))}
         </ul>
      </List>
   )
}

const Page = styled.li<{ highlight?: boolean }>`
   padding: 0.4rem 0.8rem;
   position: relative;
   transition: all 0.1s linear;

   ${p =>
      p.highlight &&
      css`
         background: ${p.theme.primary};
         outline: 2px solid ${mix(0.4, p.theme.text, p.theme.primary)};
      `}

   &:hover {
      background: ${p => p.theme.secondary};
      color: ${p => invert(p.theme.text)};
      cursor: pointer;
   }
`

const List = styled.ul`
   margin: 3rem 0;
   text-align: center;

   p {
      font-style: italic;
   }

   ul {
      display: grid;
      grid-auto-flow: column;
      justify-content: center;
      gap: 2rem;
      font-size: 2rem;
      padding: 0.6rem;
   }

   a {
      text-decoration: none;
      color: ${p => p.theme.text};
   }
`

export default Pages
