import { css } from "@emotion/react"
import styled from "@emotion/styled"
import Link from "next/link"
import { FC } from "react"

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
   return <List>
      <p>Read about specific aspects of the pack</p>
      <ul>
         {pages.map(({ link, title, highlight, slug }) =>
            <Link key={link} href={link}>
               <Page highlight={highlight} onMouseOver={() => onHover?.(slug)} onMouseLeave={() => onHover?.()}>
                  {title}
               </Page>
            </Link>
         )}
      </ul>
   </List>
}

const Page = styled.li<{ highlight?: boolean }>`
   padding: 0.4rem 0.8rem;
   position: relative;
   transition: all 0.1s linear;

   ${p => p.highlight && css`
      background: #8a804e;
      outline: 2px solid #eddd93;
      //box-shadow: 0 0 8px 0 #eddd93;
   `}

   &:hover {
      background: #DDD;
      color: black;
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
      color: #EEE;
   }
`

export default Pages