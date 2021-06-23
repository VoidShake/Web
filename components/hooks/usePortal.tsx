import React, { createContext, FC, MutableRefObject, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type Ref = MutableRefObject<HTMLElement | null>
type Map = Partial<Record<string, Ref>>

const CONTEXT = createContext<[Map, (key: string, ref: Ref) => () => void,]>([
   {}, () => {
      console.warn('Portal provider missing')
      return () => { }
   }
])

export default function usePortal(children: ReactNode, key: string) {
   const [refs] = useContext(CONTEXT)
   const ref = refs[key]

   if (ref?.current) return createPortal(children, ref.current, key)
   return null
}

export const PortalProvider: FC = ({ children }) => {
   const [map, setMap] = useState<Map>({})
   const setRef = useCallback((key: string, ref: Ref) => {
      setMap(m => ({ ...m, [key]: ref }))
      return () => setMap(m => ({ ...m, [key]: undefined }))
   }, [setMap])

   return (
      <CONTEXT.Provider value={[map, setRef]}>
         {children}
      </CONTEXT.Provider>
   )
}

export const Portal: FC<{ id: string }> = ({ children, id }) => {
   const ref = useRef<HTMLElement>(null)
   const [, setRef] = useContext(CONTEXT)

   useEffect(() => setRef(id, ref), [ref, id])

   return <section ref={ref}>
      {children}
   </section>
}