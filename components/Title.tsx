import styled from "@emotion/styled";
import Link from "next/link";
import { FC, HTMLAttributes } from "react";
import Line from "./Line";

const H1 = styled.h1`
   text-align: center;
   font-size: 4rem;
   margin: 1rem 0;
`

const Title: FC<HTMLAttributes<HTMLHeadingElement> & {
   crumbs?: Array<{
      name: string
      link: string
   }>
}> = ({ children, crumbs, ...props }) => <>

   {crumbs?.length && <div>{crumbs.map(c => <Link href={c.link}>{c.name}</Link>)}</div>}

   <H1 {...props}>{children}</H1>
   <Line />
</>

export default Title