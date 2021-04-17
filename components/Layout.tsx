import Head from 'next/head';
import React, { ReactNode } from 'react';
import Navbar from './Navbar';

type Props = {
  children?: ReactNode
  title?: string
}

const Layout = ({ children, title = 'Modpacks' }: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <Navbar />
    {children}
  </div>
)

export default Layout
