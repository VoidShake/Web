import styled from '@emotion/styled'
import { darken } from 'polished'
import { Dispatch, ReactText } from 'react'

function Select<T extends ReactText>({ values, value, onChange }: { values: T[]; value: T; onChange: Dispatch<T> }) {
   return (
      <Style value={values.indexOf(value)} onChange={e => onChange(values[Number.parseInt(e.target.value)])}>
         {values.map((v, i) => (
            <option key={v} value={i}>
               {v}
            </option>
         ))}
      </Style>
   )
}

const Style = styled.select`
   color: ${p => p.theme.text};
   border-radius: 0.5rem;
   padding: 0.3rem;

   transition: background 0.1s ease;

   &:hover {
      background: ${p => darken(p.theme.darker, p.theme.bg)};
   }

   option {
      background: ${p => darken(p.theme.darker, p.theme.bg)};
   }
`

export default Select
