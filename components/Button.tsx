import { css, Theme } from '@emotion/react'
import styled from '@emotion/styled'
import { invert } from 'polished'

export const ButtonStyle = (p: { theme: Theme }) => css`
   text-decoration: none;
   color: ${invert(p.theme.text)};
   background: ${p.theme.secondary};
   padding: 0.8rem;

   transition: outline 0.1s linear;
   outline: 0 solid ${p.theme.secondary};

   &:hover {
      outline-width: 2px;
   }
   
   svg {
      margin-left: 1rem;
   }
`

const Button = styled.button`
   ${ButtonStyle};
`

export const LinkButton = styled.a`
   ${ButtonStyle};

   &:hover {
      text-decoration: underline;
   }
`

export default Button