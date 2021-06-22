import styled from '@emotion/styled'

export default styled.a`
   text-decoration: none;
   color: black;
   background: ${p => p.theme.secondary};
   padding: 0.8rem;

   transition: outline 0.1s linear;
   outline: 0 solid ${p => p.theme.secondary};

   &:hover {
      outline-width: 2px;
      text-decoration: underline;
   }
`
