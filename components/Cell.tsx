import styled from "@emotion/styled";

const Cell = styled.div<{ area: string }>`
   grid-area: ${p => p.area};
`

export default Cell