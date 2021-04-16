import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { flatten, uniqBy } from 'lodash';
import { FC, useMemo } from "react";
import IMod from "../interfaces/mod";
import InvisibleLink from "./InvisibleLink";

const HIDDEN_CATEGORIES = [4780]

const Modlist: FC<{ mods: IMod[] }> = ({ mods }) => {

   const libs = useMemo(() => mods.filter(m => m.library), [mods])
   const categories = useMemo(() => uniqBy(flatten(mods
      .map(m => m.categories)), c => c.categoryId)
      .filter(c => !HIDDEN_CATEGORIES.includes(c.categoryId)),
      [mods]
   )

   return <Container>
      <p>{mods.length - libs.length} mods ({libs.length} libraries)</p>

      <Categories>
         {categories.map(({ categoryId, name }) =>
            <li key={categoryId}>{name}</li>
         )}
      </Categories>

      <Grid>
         {mods.map(mod => <Mod key={mod.id} {...mod} />)}
      </Grid>

   </Container>

}

const Categories = styled.ul`
   display: flex;
   list-style: none;
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

const Grid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, 200px);
  justify-content: center;

  gap: 1rem;
  padding: 2rem;
  list-style: none;
`

const Mod: FC<IMod> = ({ websiteUrl, name, icon, library }) => {

   /*
   const [scale, setScale] = useState([0, 0])

   const innerStyle = css`
      transform: rotateX(${scale[0]}deg) rotateY(${scale[1]}deg);
   `

      const resetCard = useCallback(() => setScale([0, 0]), [setScale])
   
      const updateCard = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
         const box = e.currentTarget.getBoundingClientRect()
         const x = (e.clientX - box.x) / box.width - 0.5
         const y = (e.clientY - box.y) / box.height - 0.5
         setScale([-y, x])
      }, [setScale])
   */

   return <InvisibleLink href={websiteUrl}>
      <Card library={library}>
         <img src={icon} />
         <h3>{name}</h3>
         {library && <span>Library</span>}
      </Card>
   </InvisibleLink>
}

const Card = styled.div<{ library: boolean }>`
   text-align: center;
   perspective: 40px;
   background: #0002;
   
   ${p => p.library && css`
      background: #559aed77;
   `}

   span {
      background: #0006;
      margin: 0.2rem;
      margin-left: auto;
      padding: 0.2rem 0.5rem;
      border-radius: 99999px;
   }

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


export default Modlist