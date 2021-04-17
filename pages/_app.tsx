import { css, Global } from '@emotion/react';
import { AppComponent } from "next/dist/next-server/lib/router/router";
import React from 'react';
import '../style/reset.css';

const App: AppComponent = ({ Component, pageProps }) => {

   return <>
      <Global styles={css`
      
         body {
            font-family: sans-serif;
            background: #3e4247;
            color: #EEE;
         }

         ul {
            list-style: none;
         }

         img {
            width: 100%;
            object-fit: contain;
         }

      `} />
      <Component {...pageProps} />
   </>
}

export default App