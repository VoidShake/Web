import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Image from 'next/image'
import { darken, invert, mix, saturate } from 'polished'
import { FC, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { IMod } from '../database/models/Mod'
import InvisibleLink from './InvisibleLink'

type Scheme = 'highlighted' | 'library' | 'major'

export type ModProps = IMod & {
   highlight?: boolean
   fade?: boolean
   onHover?: () => void
   onBlur?: () => void
}

const ICON_SIZE = 200

const ModCard: FC<ModProps> = ({ websiteUrl, name, icon, library, pages, slug, highlight, fade, ...events }) => {
   const scheme = useMemo<Scheme | undefined>(() => {
      if (highlight) return 'highlighted'
      if (library) return 'library'
      if (pages?.some(p => p.mods.find(m => m.slug === slug && m.relevance === 'major'))) return 'major'
   }, [library, pages, highlight, slug])

   const { formatMessage } = useIntl()

   const info = formatMessage(
      {
         defaultMessage: `Referenced in {count, plural,
      one {a page}
      other {# pages}
   }`,
      },
      { count: pages?.length ?? 0 }
   )
   const tooltip = `${info} (${pages?.map(p => p.title).join(', ')})`

   const card = (
      <Card fade={fade} scheme={scheme} onMouseOver={events.onHover} onMouseLeave={events.onBlur}>
         {icon ? <img alt={name} src={icon} /> : <Image alt={name} src='/missing-icon.png' height={ICON_SIZE} width={ICON_SIZE} />}
         <h3>{name}</h3>
         {library && <Lib>Library</Lib>}

         {pages && pages.length > 0 && <Info data-tip={tooltip} data-for='mod-info' />}
      </Card>
   )

   if (!websiteUrl) return card

   return <InvisibleLink href={websiteUrl}>{card}</InvisibleLink>
}

const Info = styled.span`
   position: absolute;
   right: 0.3rem;
   top: 0.3rem;
   background: ${p => saturate(0.5, mix(0.2, p.theme.text, p.theme.primary))};
   color: ${p => invert(p.theme.text)};
   font-weight: bolder;
   padding: 0.1rem 0.7rem;
   border-radius: 99999px;
   transition: background 0.1s linear;

   &:hover {
      background: ${p => mix(0.4, p.theme.text, p.theme.primary)};
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

const Card = styled.div<{ glow?: boolean; fade?: boolean; scheme?: Scheme }>`
   position: relative;
   text-align: center;

   background: ${p => darken(p.theme.darker, p.theme.bg)};
   color: ${p => p.theme.text};

   ${p =>
      p.scheme === 'highlighted' &&
      css`
         background: ${p.theme.secondary};
         color: ${invert(p.theme.text)};
      `}

   ${p =>
      p.scheme === 'library' &&
      css`
         background: '#559aed77';
      `}

   ${p =>
      p.scheme === 'major' &&
      css`
         background: ${p.theme.primary};
      `}

   opacity: ${p => (p.fade ? 0.2 : 1)};

   ${p =>
      p.glow &&
      css`
         outline: 2px solid ${mix(0.4, p.theme.text, p.theme.primary)};
         box-shadow: 0 0 5px 0 ${mix(0.4, p.theme.text, p.theme.primary)};
      `}

   transform: translateY(0);
   transition: background 0.1s linear, color 0.1s linear, opacity 0.4s linear, transform 0.2s ease;

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
      background: ${p => darken(p.theme.darker * 2, p.theme.bg)};
      height: ${ICON_SIZE}px;
   }
`

export default ModCard
