import { css, Global } from '@emotion/react'
import { Provider } from 'next-auth/client'
import { AppComponent } from 'next/dist/next-server/lib/router/router'
import React from 'react'
import '../style/reset.css'

const App: AppComponent = ({ Component, pageProps }) => {
   return (
      <Provider session={pageProps.session}>
         <Global
            styles={css`
               body {
                  font-family: sans-serif;
                  background: #3e4247;
                  color: #eee;
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
         <Component {...pageProps} />
      </Provider>
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
