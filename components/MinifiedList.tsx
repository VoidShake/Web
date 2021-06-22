import styled from "@emotion/styled";
import { darken } from "polished";
import { FC, ReactNodeArray, useEffect, useReducer, useRef } from "react";

const MinifiedList: FC<{
   minified?: boolean,
   toggleable?: boolean
   object?: string
   children: ReactNodeArray
}> = ({ children, object = 'element', toggleable = true, ...props }) => {

   const [minified, toggle] = useReducer((b: boolean) => !b, !!props.minified)
   const ref = useRef<HTMLUListElement>(null)

   const [height, updateHeight] = useReducer(v => {
      const h = ref.current?.offsetHeight || v
      if (h > HIDDEN_SIZE) return h
      return v
   }, undefined)

   useEffect(() => {
      updateHeight()
   }, [ref, children])

   useEffect(() => {
      window.addEventListener('resize', updateHeight)
      return () => window.removeEventListener('resize', updateHeight)
   }, [updateHeight])

   return <Style toggleable={toggleable} height={height} ref={ref} minified={minified} onLoad={updateHeight}>
      {toggleable &&
         <Toggle minified={minified} onClick={toggle}>
            {minified ? 'show' : 'hide'}
            <span> {children.length} {object}{children.length === 1 ? '' : 's'}</span>
         </Toggle>
      }
      {children}
   </Style>

}

const HIDDEN_SIZE = 40

const Toggle = styled.li<{ minified: boolean }>`
   position: absolute;
   top: 0;
   width: 100%;
   text-align: center;
   background: ${p => darken(p.theme.darker * 0.5, p.theme.bg)};

   padding: calc(${HIDDEN_SIZE / 2}px - 0.5rem) 0;
   user-select: none;
   cursor: pointer;
`

const Style = styled.ul<{ minified: boolean, height?: number, toggleable: boolean }>`
   position: relative;
   transition: height 0.2s ease;
   height: ${p => (p.minified && p.height) ? `${HIDDEN_SIZE}` : p.height}px;
   overflow-y: hidden;
   padding-top: ${p => p.toggleable ? HIDDEN_SIZE : 0}px;
`

export default MinifiedList