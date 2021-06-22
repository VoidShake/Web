import styled from '@emotion/styled'
import { darken } from 'polished'
import { Dispatch, ElementType, FC } from 'react'

const Style = styled.input`
   padding: 1rem;
   background: ${p => darken(p.theme.darker * 2, p.theme.bg)};
   color: ${p => p.theme.text};
`

const Input: FC<{
   value: string
   onChange: Dispatch<string>
   placeholder?: string
   type?: string
   required?: boolean
   as?: ElementType,
   id?: string
   className?: string
}> = ({ onChange, type = 'text', ...props }) => <Style {...props} type={type} onChange={e => onChange(e.target.value)} />

export const Textarea: typeof Input = props => <Input {...props} as='textarea' />

export default Input
