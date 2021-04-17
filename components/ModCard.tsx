import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { FC, useMemo } from 'react'
import IMod from '../interfaces/mod'
import InvisibleLink from './InvisibleLink'

const Style = {
   HIGHLIGHTED: { background: '#EEE', text: '#000' },
   LIBRARY: { background: '#559aed77', text: '#EEE' },
   MAJOR: { background: '#8a804e', text: '#EEE' },
}

const ModCard: FC<
   IMod & {
      onHover?: () => void
      onBlur?: () => void
   }
> = ({ websiteUrl, name, icon, library, pages, slug, highlight, fade, ...events }) => {
   const style = useMemo(() => {
      if (highlight) return Style.HIGHLIGHTED
      if (library) return Style.LIBRARY
      if (pages?.some(p => p.mods.find(m => m.slug === slug && m.relevance === 'major'))) return Style.MAJOR
   }, [library, pages, highlight])

   const info = `Referenced in ${pages?.length} ${pages?.length === 1 ? 'page' : 'pages'}`
   const tooltip = `${info} (${pages?.map(p => p.title).join(', ')})`

   return (
      <InvisibleLink href={websiteUrl}>
         <Card fade={fade} {...style} onMouseOver={events.onHover} onMouseLeave={events.onBlur}>
            <img alt={name} src={icon} />
            <h3>{name}</h3>
            {library && <Lib>Library</Lib>}

            {pages && pages.length > 0 && <Info data-tip={tooltip} data-for='mod-info' />}
         </Card>
      </InvisibleLink>
   )
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

const Card = styled.div<Partial<typeof Style.HIGHLIGHTED> & { glow?: boolean; fade?: boolean }>`
   position: relative;
   text-align: center;

   background: ${p => p.background ?? '#0002'};
   color: ${p => p.text ?? '#EEE'};

   opacity: ${p => (p.fade ? 0.2 : 1)};

   ${p =>
      p.glow &&
      css`
         outline: 2px solid #eddd93;
         box-shadow: 0 0 5px 0 #eddd93;
      `}

   transform: translateY(0);
   transition: background 0.1s linear, color 0.1s linear, opacity 0.4s linear;

   &:hover {
      transform: translateY(-0.4rem);
      background: #ddd;
      color: black;
   }

   display: grid;
   align-items: center;

   grid-template:
      'image'
      'title' 4rem;

   h3 {
      padding: 1rem 0;
   }

   img {
      height: 200px;
   }
`

export default ModCard
