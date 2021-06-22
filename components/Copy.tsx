import styled from "@emotion/styled"
import { Copy as Icon } from "@styled-icons/fa-solid"
import { invert } from "polished"
import { FC, useCallback, useEffect, useMemo, useState } from "react"
import useTooltip from "./hooks/useTooltip"

const Text = styled.button`
   text-decoration: underline;
   padding: 0.5rem;
   transition: all 0.1s linear;
   border-radius: 0.2rem;

   & + span {
      margin-left: 0.5rem;
   }

   svg {
      margin-left: 0.7rem;
   }

   &:hover {
      background: ${p => p.theme.secondary};
      color: ${p => invert(p.theme.secondary)};
      cursor: copy;
   }

   transform: scale(1.0);
   &:active {
      transform: scale(1.2);
   }
`

const Copy: FC<{
   content?: string,
   children: string,
}> = ({ content, children }) => {

   const [justCopied, setJustCopied] = useState(false)
   const copyText = useMemo(() => content ?? children, [content, children])

   const click = useCallback(() => {
      navigator.clipboard.writeText(copyText)
      setJustCopied(true)
   }, [copyText])

   useEffect(() => {
      const timeout = setTimeout(() => setJustCopied(false), 3000)
      return () => clearTimeout(timeout)
   }, [justCopied])

   const tooltip = useTooltip(`copy-${copyText}`, { event: 'click', eventOff: 'mouseleave', afterShow: click })

   return <Text data-tip='Copied' data-for={`copy-${copyText}`} onClick={click}>
      <span>{children}</span>
      <Icon size='1rem' />
      {tooltip}
   </Text>
}

export default Copy