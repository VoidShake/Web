import { css, Global } from '@emotion/react';
import { AppComponent } from "next/dist/next-server/lib/router/router";
import React, { useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import '../style/reset.css';

const App: AppComponent = ({ Component, pageProps }) => {
   const [mounted, setMounted] = useState(false)
   useEffect(() => {
      setMounted(true)
      return () => setMounted(false)
   })

   return <>
      <Global styles={css`
         body {
            font-family: sans-serif;
            background: #3e4247;
            color: #EEE;
         }
      `} />
      {mounted && <ReactTooltip backgroundColor='#000' insecure={false} effect='solid' />}
      <Component {...pageProps} />
   </>
}

export default App