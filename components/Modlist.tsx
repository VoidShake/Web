import styled from "@emotion/styled";
import { flatten, uniqBy } from 'lodash';
import { FC, useCallback, useMemo } from "react";
import IMod from "../interfaces/mod";
import ModCard from "./ModCard";

const HIDDEN_CATEGORIES = [4780]

const Modlist: FC<{
   mods: IMod[]
   onHover?: (mod?: IMod) => void
}> = ({ mods, ...events }) => {

   const somethingHighlighted = useMemo(() => mods.some(m => m.highlight), [mods])

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
      .sort((a, b) => rank(b) - rank(a)),
      [mods]
   )

   return <Container>
      <p>{mods.length - libs} mods ({libs} libraries)</p>

      <Categories>
         {categories.map(({ categoryId, name }) =>
            <li key={categoryId}>{name}</li>
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

const Categories = styled.ul`
   display: flex;
   flex-wrap: wrap;
   padding: 0.5rem 3rem;
   max-width: 1400px;
   margin: 0 auto;
   justify-content: center;

   li {
      padding: 0.5rem;
   }
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