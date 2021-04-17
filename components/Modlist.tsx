import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { flatten, uniqBy } from 'lodash';
import { FC, useCallback, useMemo, useState } from "react";
import IMod from "../interfaces/mod";
import useTooltip from "./hooks/useTooltip";
import ModCard from "./ModCard";

const HIDDEN_CATEGORIES = [4780]

const Modlist: FC<{
   mods: IMod[]
   onHover?: (mod?: IMod) => void
}> = ({ mods, ...events }) => {

   const [hoveredCategory, hoverCategory] = useState<number>()
   const [selectedCategory, selectCategory] = useState<number>()

   const libs = useMemo(() => mods.filter(m => m.library).length, [mods])
   const categories = useMemo(() => uniqBy(flatten(mods
      .map(m => m.categories)), c => c.categoryId)
      .filter(c => !HIDDEN_CATEGORIES.includes(c.categoryId)),
      [mods]
   )

   const rank = useCallback((mod: IMod) => {
      let rank = mod.popularityScore
      if (mod.library) rank -= 100000000000
      if (mod.pages?.some(p => p.mods.find(m => m.slug === mod.slug && m.relevance === 'major'))) rank += 1000000000
      return rank
   }, [])

   const sorted = useMemo(() => mods
      .filter(m => !selectedCategory || m.categories.some(c => c.categoryId === selectedCategory))
      .map(m => ({ ...m, highlight: m.highlight || m.categories.some(c => c.categoryId === hoveredCategory) }))
      .sort((a, b) => rank(b) - rank(a)),
      [mods, hoveredCategory, selectedCategory]
   )

   const somethingHighlighted = useMemo(() => sorted.some(m => m.highlight), [sorted])
   const tooltip = useTooltip('mod-info')

   return <Container>
      {tooltip}
      <p>{mods.length - libs} mods ({libs} libraries)</p>

      <Categories>
         {categories.map(({ categoryId, name }) =>
            <Category
               selected={categoryId === selectedCategory}
               onMouseOver={() => hoverCategory(categoryId)}
               onMouseLeave={() => hoverCategory(undefined)}
               onClick={() => selectedCategory === categoryId ? selectCategory(undefined) : selectCategory(categoryId)}
               key={categoryId} >
               {name}
            </Category>
         )}
      </Categories>

      <Grid>
         {sorted.map(mod => <ModCard
            {...mod}
            key={mod.id}
            onHover={() => events.onHover?.(mod)}
            onBlur={() => events.onHover?.()}
            fade={somethingHighlighted && !mod.highlight}
         />)}
      </Grid>

   </Container>

}

const Category = styled.li<{ selected?: boolean }>`
   padding: 0.5rem;
   margin: 0 0.2rem;
   cursor: pointer;

   transition: all 0.1s linear, color 0.1s linear;

   ${p => p.selected && css`
      background: #DDD;
      color: black;
   `}

   &:hover {
      background: #DDD;
      color: black;
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