import styled from "@emotion/styled"
import { Dispatch, FC } from "react"

const Style = styled.input`
   padding: 1rem;
`

const Input: FC<{
   value: string
   onChange: Dispatch<string>
   placeholder?: string
   type?: string
   required?: boolean
}> = ({ onChange, type = 'text', ...props }) => (
   <Style {...props} type={type} onChange={e => onChange(e.target.value)} />
)

export default Input