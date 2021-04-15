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
      `} />
      <Component {...pageProps} />
   </>
}

export default App