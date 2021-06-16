import styled from "@emotion/styled";
import { DateTime } from "luxon";
import { useRouter } from 'next/router';
import { FC, useMemo } from "react";
import Link from '../components/Link';
import { IRelease } from "../database/models/Release";

const Release: FC<IRelease> = ({ version, name, changelog, date, children }) => {

   const time = useMemo(() => DateTime.fromISO(date), [date])
   const { query } = useRouter()

   return (
      <Link href={`/${query.pack}?version=${version}`}>
         <Container>
            <h2>{name ?? `Version ${version}`}</h2>
            <Time data-tip={time.toLocaleString()} data-for={'release'}>{time.toRelative()}</Time>
            <Changelog>
               {changelog.split('\n').map((line, i) =>
                  <p key={i}>{line}</p>
               )}
            </Changelog>
            {children}
         </Container>
      </Link>
   )
}

const Changelog = styled.div`
   grid-area: changelog;
`

const Time = styled.span`
   grid-area: time;
   background: #34caf0;
   color: black;
   padding: 0.4rem 0.2rem;
   text-align: center;
   border-radius: 9999px;
   cursor: help;
`

const Container = styled.li`
   width: 600px;
   max-width: 100vw;
   padding: 2rem;

   outline: #0003 solid 1px;
   transition: background 0.1s linear, outline 0.1s linear;

   &:hover {
      background: #DDD;
      outline-width: 0;
      color: black;
   }

   display: grid;
   grid-template:
      "name time"
      "changelog changelog"
      / 2fr 1fr;

   row-gap: 2rem;
   align-items: center;
`

export default Release