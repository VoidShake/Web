import styled from "@emotion/styled";

export default styled.div<{ invisible?: boolean }>`
   height: 2rem;
   width: calc(100% - 8rem);
   background: ${p => p.invisible ? 'transparent' : 'linear-gradient(#0001, transparent)'};
   margin: 2rem auto;
   border-radius: 99999px;
`