import { css, Theme } from '@emotion/react'
import styled from '@emotion/styled'
import { ArrowAltCircleRight, MinusCircle, PlusCircle } from '@styled-icons/fa-solid'
import { darken } from 'polished'
import { createElement, FC, useMemo } from 'react'
import { IMod } from '../database/models/Mod'
import { Left, Right } from './Text'

export interface VersionedMod extends IMod {
   from?: IMod['version']
   to?: IMod['version']
   change?: Change
}

export enum Change {
   unchanged,
   added,
   removed,
   changed,
}

export function getChange({ from, to }: Partial<VersionedMod>): Change {
   if (!from) return Change.added
   if (!to) return Change.removed
   if (from.date !== to.date) return Change.changed
   return Change.unchanged
}

const ModLine: FC<VersionedMod> = ({ name, from, to, ...props }) => {

   const change = useMemo(() => props.change ?? getChange({ from, to }), [from, to, props.change])
   const icon = useMemo(() => {
      switch (change) {
         case Change.added: return PlusCircle
         case Change.removed: return MinusCircle
         case Change.changed: return ArrowAltCircleRight
         default: return 'span'
      }
   }, [change])

   return <Style change={change}>

      <span>{name}</span>

      <Version change={change}>
         <Right>{change === Change.changed && to?.file}</Right>

         {createElement(icon, { size: '1rem' })}

         <Left>{from?.file ?? to?.file}</Left>
      </Version>

   </Style>
}

const Version = styled.span<{ change: Change }>`
   display: grid;
   grid-template-columns: ${p => p.change === Change.changed
      ? '1fr auto 1fr'
      : '0.75fr auto 1.25fr'
   };
   gap: 1rem;
   justify-content: center;
`

export const ChangeStyle = (p: { theme: Theme, change: Change }) => css`
   ${p.change === Change.added && css`
      background: #64aa3c;
   `}

   ${p.change === Change.removed && css`
      background: #be4239;
   `}

   ${p.change === Change.changed && css`
      background: #8f7c3e;
   `}

   ${p.change === Change.unchanged && css`
      background: ${darken(p.theme.darker, p.theme.bg)};;
   `}
`

const Style = styled.li<{ change: Change }>`
   padding: 0.8rem;

   display: grid;
   grid-template-columns: 400px 1fr;

   ${ChangeStyle};
`

export default ModLine