import { css, Global, useTheme } from '@emotion/react'
import { NextComponentType } from 'next'
import { Provider as AuthProvider } from 'next-auth/client'
import NextApp, { AppContext } from 'next/app'
import { AppProps } from 'next/dist/next-server/lib/router/router'
import React, { FC } from 'react'
import { IntlProvider } from 'react-intl'
import { PortalProvider } from '../components/hooks/usePortal'
import { SettingsProvider } from '../components/hooks/useSettings'
import { getTranslations } from '../lib/localization'
import '../style/reset.css'

type Props = AppProps & {
   messages: Record<string, string>
   locale: string
}

const App: NextComponentType<AppContext, Props, Props> = ({ Component, pageProps, locale, messages }) => {

   return (
      <PortalProvider>
         <SettingsProvider>
            <IntlProvider defaultLocale='en' locale={locale} messages={messages}>
               <AuthProvider session={pageProps.session}>
                  <Styles />
                  <Component {...pageProps} />
               </AuthProvider>
            </IntlProvider>
         </SettingsProvider>
      </PortalProvider>
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

App.getInitialProps = async ctx => {
   const requestedLocale = 'de'

   const [locale, messages] = await getTranslations(requestedLocale)
   const props = await NextApp.getInitialProps(ctx)

   return { ...props as any, locale, messages }
}

export default App
