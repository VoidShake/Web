import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { FC, useMemo } from "react";
import IMod from "../interfaces/mod";
import InvisibleLink from "./InvisibleLink";

const ModCard: FC<IMod & {
   onHover?: () => void
   onBlur?: () => void
}> = ({ websiteUrl, name, icon, library, pages, slug, highlight, ...events }) => {

   const color = useMemo(() => {
      if(highlight) return '#c7b769';
      if (library) return '#559aed77'
      if (pages?.some(p => p.mods.find(m => m.slug === slug && m.relevance === 'major'))) return '#8a804e'
   }, [library, pages, highlight])

   return <InvisibleLink href={websiteUrl}>
      <Card glow={highlight} color={color} onMouseOver={events.onHover} onMouseLeave={events.onBlur}>

         <img src={icon} />
         <h3>{name}</h3>
         {library && <Lib>Library</Lib>}

         {pages && pages.length > 0 && <Info data-tip={`Referenced in ${pages.length} ${pages.length === 1 ? 'page' : 'page'}`} />}

      </Card>
   </InvisibleLink>
}

const Info = styled.span`
   position: absolute;
   right: 0.3rem;
   top: 0.3rem;
   background: #c7b769;
   color: black;
   font-weight: bolder;
   padding: 0.1rem 0.7rem;
   border-radius: 99999px;
   transition: background 0.1s linear;

   &:hover {
      background: #eddd93;
   }

   &::after {
      content: 'i';
      font-family: serif;
      font-size: 1.4rem;
   }
`

const Lib = styled.span`
   background: #0003;
   margin: 0.4rem;
   margin-left: auto;
   padding: 0.2rem 0.5rem;
   border-radius: 99999px;
`

const Card = styled.div<{ color?: string, glow?: boolean }>`
   position: relative;
   text-align: center;
   
   background: ${p => p.color ?? '#0002'};
   ${p => p.glow && css`
      outline: 2px solid #eddd93;
      box-shadow: 0 0 5px 0 #eddd93;
   `}

   transform: translateY(0);
   transition: all 0.1s linear;

   &:hover {
      transform: translateY(-0.4rem);
      background: #DDD;
      color: black;
   }

   display: grid;
   align-items: center;

   grid-template: 
      "image"
      "title" 4rem;

   h3 {
      padding: 1rem 0;
   }

   img {
      width: 100%;
      height: 200px;
      object-fit: contain;
   }
`

export default ModCard