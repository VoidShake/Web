import styled from '@emotion/styled'
import { darken } from 'polished'
import { Dispatch, ElementType, FC } from 'react'

const Style = styled.input`
   padding: 1rem;
   background: ${p => darken(p.theme.darker * 2, p.theme.bg)};
   color: ${p => p.theme.text};
`

interface BaseProps<T> {
   required?: boolean
   id?: string
   className?: string
   value: T
   onChange: Dispatch<T>
}

const Input: FC<BaseProps<string> & {
   placeholder?: string
   type?: string
   as?: ElementType,
}> = ({ onChange, type = 'text', ...props }) => <Style {...props} type={type} onChange={e => onChange(e.target.value)} />

export const Textarea: typeof Input = props => <Input {...props} as='textarea' />

const CheckboxStyle = styled.input`
   margin: 0 0.5rem;
`

export const Checkbox: FC<BaseProps<boolean>> = ({ value, onChange, ...props }) => (
   <CheckboxStyle type='checkbox' checked={value ?? false} onChange={e => onChange(e.target.checked)} {...props} />
)

export default Input
