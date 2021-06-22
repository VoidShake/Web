import '@emotion/react';

declare module '@emotion/react' {

   export interface Theme {
      bg: string
      text: string
      primary: string
      secondary: string
      tooltip: string
      darker: number
   }

}