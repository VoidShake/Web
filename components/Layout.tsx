import Head from 'next/head';
import React, { ReactNode } from 'react';
import Navbar from './Navbar';

type Props = {
  children?: ReactNode
  title?: string
  image?: string
}

const Layout = ({ children, title = 'Modpacks', image = '/icon.png' }: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet='utf-8' />
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />

      <link rel='icon' href='/favicon.ico' />

      <meta name='theme-color' content='#3e4247' />
      <meta name='description' content='Browse modpacks' />
      <link rel='apple-touch-icon' href='/icon.png' />

      <meta property='og:type' content='website' />
      <meta property='og:title' content={title} />
      <meta property='og:image' content={image} />

      <link rel='manifest' href='/manifest.json' />

    </Head>
    <Navbar />
    {children}
  </div>
)

export default Layout
