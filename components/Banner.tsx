import styled from "@emotion/styled";
import { darken, lighten } from "polished";
import { FC } from "react";
import usePortal from "./hooks/usePortal";

const Style = styled.div`
   padding: 1rem;
   background: linear-gradient(45deg, 
      ${p => lighten(0.2, p.theme.primary)}, 
      ${p => p.theme.primary} 10%,
      ${p => p.theme.primary} 70%,
      ${p => darken(0.1, p.theme.primary)}
   );
   text-align: center;
   width: 100%;
   margin-bottom: 10px;
`

const Banner: FC = ({ children }) => usePortal(
   <Style>{children}</Style>,
   'top'
)

export default Banner