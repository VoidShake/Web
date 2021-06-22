import styled from '@emotion/styled'
import { DateTime } from 'luxon'
import { useRouter } from 'next/router'
import { invert, lighten } from 'polished'
import { FC, useMemo } from 'react'
import Link from '../components/Link'
import { IRelease } from '../database/models/Release'

const Release: FC<IRelease> = ({ version, name, changelog, date, children }) => {
   const time = useMemo(() => DateTime.fromISO(date), [date])
   const { query } = useRouter()

   return (
      <Container>
         <Link href={`/${query.pack}?version=${version}`}>
            <h2>{name ?? `Version ${version}`}</h2>
         </Link>

         <Time data-tip={time.toLocaleString()} data-for='release'>
            {time.toRelative()}
         </Time>

         <Buttons>
            <Link href={`/${query.pack}/diff/${version}`}>
               <More data-tip='Detailed changes' data-for='release'>
                  More
               </More>
            </Link>
         </Buttons>

         <Changelog>
            {changelog.split('\n').map((line, i) => (
               <p key={i}>{line}</p>
            ))}
         </Changelog>

         {children}
      </Container>
   )
}

const More = styled.span`
   padding: 0.4rem 1rem;
   border-radius: 9999px;

   transition: background 0.1s ease;

   &:hover {
      background: ${p => lighten(0.2, p.theme.primary)} !important;
   }
`

const Changelog = styled.div`
   grid-area: changelog;
`

const Buttons = styled.div`
   grid-area: buttons;
   display: grid;
   grid-auto-flow: column;
   justify-content: center;
   gap: 0.5rem;
`

const Time = styled.span`
   background: #34caf0;
   color: black;
   cursor: help;
   grid-area: labels;
   padding: 0.4rem 0.6rem;
   border-radius: 9999px;
   justify-self: end;
`

const Container = styled.li`
   position: relative;
   width: 600px;
   max-width: 100vw;
   padding: 2rem;
   padding-bottom: 1rem;

   outline: #0003 solid 1px;
   transition: background 0.1s linear, outline 0.1s linear;

   &:hover {
      background: ${p => p.theme.secondary};
      outline-width: 0;
      &,
      > a {
         color: ${p => invert(p.theme.text)};
      }

      ${More} {
         background: ${p => p.theme.primary};
      }
   }

   display: grid;
   grid-template:
      'name labels'
      'changelog changelog'
      'buttons buttons'
      / 1fr 1fr;

   row-gap: 2rem;
   align-items: center;
`

export default Release
