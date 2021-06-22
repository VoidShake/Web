import { useTheme } from '@emotion/react'
import { useEffect, useState } from 'react'
import ReactTooltip, { TooltipProps } from 'react-tooltip'

export default function useTooltip(id: string, props: TooltipProps = {}) {
   const [mounted, setMounted] = useState(false)

   useEffect(() => {
      setMounted(true)
      return () => setMounted(false)
   })

   const theme = useTheme()

   const tooltip = <ReactTooltip id={id} backgroundColor={theme.tooltip} insecure={false} effect='solid' {...props} />

   return mounted ? tooltip : null
}
