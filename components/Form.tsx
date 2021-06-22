import styled from "@emotion/styled";

const Form = styled.form`
   display: grid;

   margin-top: 2rem;
   margin: 0 auto;

   gap: 1rem;
   font-size: 2rem;
   width: fit-content;

   label {
      font-size: 1rem;
      margin-bottom: -0.5rem;
      font-style: italic;
   }

   textarea {
      min-height: 200px;
      max-height: 700px;
      resize: none;
   }
`

export default Form