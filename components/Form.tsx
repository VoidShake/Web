import styled from "@emotion/styled";

const Form = styled.form`

   margin-top: 2rem;
   margin: 0 auto;

   font-size: 2rem;
   width: fit-content;
   align-items: end;

   label {
      margin-bottom: -0.5rem;
      font-size: 1rem;
      font-style: italic;
   }

   textarea {
      min-height: 200px;
      max-height: 700px;
      resize: none;
   }

   &, & > div {
      display: grid;
      gap: 1rem;
   }
`

export default Form