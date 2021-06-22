import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { darken, invert } from 'polished'
import { FC, useMemo } from 'react'
import { IMod } from '../database/models/Mod'
import InvisibleLink from './InvisibleLink'

type Scheme = 'highlighted' | 'library' | 'major'

const ModCard: FC<
   IMod & {
      onHover?: () => void
      onBlur?: () => void
   }
> = ({ websiteUrl, name, icon, library, pages, slug, highlight, fade, ...events }) => {
   const scheme = useMemo<Scheme | undefined>(() => {
      if (highlight) return 'highlighted'
      if (library) return 'library'
      if (pages?.some(p => p.mods.find(m => m.slug === slug && m.relevance === 'major'))) return 'major'
   }, [library, pages, highlight])

   const info = `Referenced in ${pages?.length} ${pages?.length === 1 ? 'page' : 'pages'}`
   const tooltip = `${info} (${pages?.map(p => p.title).join(', ')})`

   return (
      <InvisibleLink href={websiteUrl}>
         <Card fade={fade} scheme={scheme} onMouseOver={events.onHover} onMouseLeave={events.onBlur}>
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

const Card = styled.div<{ glow?: boolean; fade?: boolean, scheme?: Scheme }>`
   position: relative;
   text-align: center;

   background: ${p => darken(0.05, p.theme.bg)};
   color: ${p => p.theme.text};

   ${p => p.scheme === 'highlighted' && css`
      background: ${p.theme.secondary};
      color: ${invert(p.theme.text)};
   `}

   ${p => p.scheme === 'library' && css`
      background: '#559aed77';
   `}

   ${p => p.scheme === 'major' && css`
      background: ${p.theme.primary};
   `}

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
      background: ${p => p.theme.secondary};
      color: ${p => invert(p.theme.text)};
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
      background: #0001;
      height: 200px;
   }
`

export default ModCard
