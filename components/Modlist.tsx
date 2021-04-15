import styled from "@emotion/styled";
import { FC, useMemo } from "react";
import IMod from "../interfaces/mod";
import InvisibleLink from "./InvisibleLink";

const Modlist: FC<{ mods: IMod[] }> = ({ mods }) => {

   const libs = useMemo(() => mods.filter(m => m.library), [mods])

   return <Container>
      <p>{mods.length - libs.length} mods ({libs.length} libraries)</p>

      <Grid>
         {mods.map(mod => <Mod key={mod.id} {...mod} />)}
      </Grid>

   </Container>

}

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
      <Card>
         <h3>{name}</h3>
         {library && <span>Lib</span>}
         <img src={icon} />
      </Card>
   </InvisibleLink>
}

const Card = styled.div`
   text-align: center;
   perspective: 40px;
   background: #FFF2;

   transform: translateY(0);
   transition: transform 0.1s linear;
   &:hover {
      transform: translateY(-0.4rem);
   }

   h3 {
      margin-bottom: 1rem;
      height: 3.5rem;
      padding: 1rem 0;
   }

   img {
      width: 100%;
      height: 200px;
      object-fit: contain;
   }
`


export default Modlist