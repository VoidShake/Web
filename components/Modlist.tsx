import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { flatten, uniq } from 'lodash'
import { invert } from 'polished'
import { FC, useCallback, useMemo, useState } from 'react'
import { IMod } from '../database/models/Mod'
import ModCard, { ModProps } from './ModCard'
import useTooltip from './hooks/useTooltip'

// TODO
const HIDDEN_CATEGORIES = ['4780']

const Modlist: FC<{
   mods: ModProps[]
   onHover?: (mod?: IMod) => void
}> = ({ mods, ...events }) => {
   const [hoveredCategory, hoverCategory] = useState<string>()
   const [selectedCategory, selectCategory] = useState<string>()

   const libs = useMemo(() => mods.filter(m => m.library).length, [mods])
   const categories = useMemo(() => uniq(flatten(mods.map(m => m.categories))).filter(c => !HIDDEN_CATEGORIES.includes(c)), [mods])

   const rankOf = useCallback((mod: IMod) => {
      let rank = mod.popularityScore ?? 0
      if (mod.library) rank -= 100000000000
      if (mod.pages?.some(p => p.mods.find(m => m.slug === mod.slug && m.relevance === 'major'))) rank += 1000000000
      return rank
   }, [])

   const [librariesShown, showLibraries] = useState(false)
   const filtered = useMemo<ModProps[]>(() => (librariesShown ? mods : mods.filter(it => !it.library)), [mods, librariesShown])

   const sorted = useMemo<ModProps[]>(
      () =>
         filtered
            .filter(m => !selectedCategory || m.categories.some(c => c === selectedCategory))
            .map(m => ({ ...m, highlight: m.highlight || m.categories.some(c => c === hoveredCategory) }))
            .sort((a, b) => rankOf(b) - rankOf(a)),
      [filtered, hoveredCategory, selectedCategory, rankOf]
   )

   const somethingHighlighted = useMemo(() => sorted.some(m => m.highlight), [sorted])
   const tooltip = useTooltip('mod-info')

   return (
      <Container>
         {tooltip}
         <p>
            {mods.length - libs} mods ({libs} libraries <input type='checkbox' checked={librariesShown} onChange={e => showLibraries(e.target.checked)} />)
         </p>

         <Categories>
            {categories.map(name => (
               <Category
                  selected={name === selectedCategory}
                  onMouseOver={() => hoverCategory(name)}
                  onMouseLeave={() => hoverCategory(undefined)}
                  onClick={() => (selectedCategory === name ? selectCategory(undefined) : selectCategory(name))}
                  key={name}>
                  {name}
               </Category>
            ))}
         </Categories>

         <Grid>
            {sorted.map(mod => (
               <ModCard {...mod} key={mod.id} onHover={() => events.onHover?.(mod)} onBlur={() => events.onHover?.()} fade={somethingHighlighted && !mod.highlight} />
            ))}
         </Grid>
      </Container>
   )
}

const Category = styled.li<{ selected?: boolean }>`
   padding: 0.5rem;
   margin: 0 0.2rem;
   cursor: pointer;

   transition: all 0.1s linear, color 0.1s linear;

   ${p =>
      p.selected &&
      css`
         background: ${p.theme.secondary};
         color: ${invert(p.theme.text)};
      `}

   &:hover {
      background: ${p => p.theme.secondary};
      color: ${p => invert(p.theme.text)};
   }
`

const Categories = styled.ul`
   display: flex;
   flex-wrap: wrap;
   padding: 0.5rem 3rem;
   max-width: 1400px;
   margin: 0 auto;
   justify-content: center;
`

const Container = styled.div`
   text-align: center;
`

export const Grid = styled.ul`
   display: grid;
   grid-template-columns: repeat(auto-fill, 200px);
   justify-content: center;

   gap: 1rem;
   padding: 2rem;
`

export default Modlist
