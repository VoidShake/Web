import styled from "@emotion/styled";
import { createContext, createRef, FC, MutableRefObject, useContext, useMemo, useRef } from "react";
import { createPortal } from "react-dom";

const context = createContext<MutableRefObject<HTMLDivElement | null>>(createRef())

const Timeline: FC = ({ children }) => {
   const ref = useRef<HTMLDivElement | null>(null)

   return <context.Provider value={ref}>
      <Line ref={ref} />
      {children}
   </context.Provider>
}

export const TimelineDot: FC = () => {
   const ref = useRef<HTMLDivElement | null>(null)
   const line = useContext(context)
   const top = useMemo(() => {
      const reference = ref.current?.parentElement
      if (reference && line.current) return reference.offsetTop + (reference.offsetHeight / 2) - line.current.offsetTop
      return 0
   }, [ref.current, line.current])

   return <>
      <div ref={ref} />
      {line.current && createPortal(<Dot top={top} />, line.current)}
   </>
}

const Line = styled.div`
   position: absolute;
   background: linear-gradient(transparent, #BBB 4rem, #EEE calc(100% - 4rem), transparent);
   width: 2px;
   height: calc(100% - 4rem);
   margin: 0 auto;
   top: 2rem;
   right: -15rem;
`

const Dot = styled.div<{ top: number }>`
   position: absolute;
   top: ${p => p.top}px;
   left: calc(1px - 0.5rem);
   width: 1rem;
   height: 1rem;
   background: #EEE;
   border-radius: 9999px;
`

export default Timeline