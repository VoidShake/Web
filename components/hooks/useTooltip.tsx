import { useEffect, useState } from "react"
import ReactTooltip from "react-tooltip"

export default function useTooltip(id: string) {
   const [mounted, setMounted] = useState(false)

   useEffect(() => {
      setMounted(true)
      return () => setMounted(false)
   })

   const tooltip = <ReactTooltip id={id} backgroundColor='#000' insecure={false} effect='solid' />

   return mounted ? tooltip : null

}