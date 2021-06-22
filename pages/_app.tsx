import { css, Global, Theme, ThemeProvider, useTheme } from '@emotion/react'
import { Provider as AuthProvider } from 'next-auth/client'
import { AppComponent } from 'next/dist/next-server/lib/router/router'
import React, { FC, useEffect, useReducer } from 'react'
import '../style/reset.css'
import dark from '../themes/dark'
import light from '../themes/light'

const App: AppComponent = ({ Component, pageProps }) => {
   const [theme, toggleTheme] = useReducer((current: Theme) => current === dark ? light : dark, dark)

   useEffect(() => {
      window.addEventListener('keyup', toggleTheme)
      return () => window.removeEventListener('keyup', toggleTheme)
   }, [toggleTheme])

   return (
      <ThemeProvider theme={theme}>
         <AuthProvider session={pageProps.session}>
            <Styles />
            <Component {...pageProps} />
         </AuthProvider>
      </ThemeProvider>
   )
}

const Styles: FC = () => {
   const { bg, text } = useTheme()
   return (
      <Global
         styles={css`
               body {
                  font-family: sans-serif;
                  background: ${bg};
                  color: ${text};
               }

               ul {
                  list-style: none;
               }

               img {
                  width: 100%;
                  object-fit: contain;
               }

               ${scrollbar}
            `}
      />
   )
}

const scrollbar = css`
   ::-webkit-scrollbar {
      width: auto;
   }

   ::-webkit-scrollbar-track {
      background: #3e4247;
   }

   ::-webkit-scrollbar-thumb {
      background: #333438;
      border-radius: 6px;
   }

   ::-webkit-scrollbar-thumb:hover {
      background: #27292c;
   }
`

export default App
