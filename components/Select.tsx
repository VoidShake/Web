import styled from "@emotion/styled";
import { Dispatch, ReactText } from "react";

function Select<T extends ReactText>({ values, value, onChange }: {
   values: T[]
   value: T
   onChange: Dispatch<T>
}) {
   return <Style value={values.indexOf(value)} onChange={e => onChange(values[Number.parseInt(e.target.value)])}>
      {values.map((v, i) =>
         <option key={v} value={i}>
            {v}
         </option>
      )}
   </Style>
}

const Style = styled.select`
   color: #EEE;
   border-radius: 0.5rem;
   padding: 0.3rem;

   transition: background 0.1s ease;
   &:hover {
      background: #0002;
   }

   option {
      background: #0002;
   }
`

export default Select