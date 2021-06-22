import { ThemeProvider } from '@emotion/react';
import { merge } from "lodash";
import { createContext, Dispatch, FC, useContext, useEffect, useMemo, useReducer } from 'react';
import dark from '../../themes/dark';
import light from '../../themes/light';

interface Settings {
   dark: boolean
}

const DEFAULT: Settings = {
   dark: true
}

const CONTEXT = createContext<[Settings, Dispatch<Partial<Settings>>]>([DEFAULT, () => console.warn('settings provider missing')])

export default function useSettings() {
   return useContext(CONTEXT)
}

export const SettingsProvider: FC = ({ children }) => {

   const [settings, modify] = useReducer((current: Settings, modified: Partial<Settings>) => {
      const changed = merge({ ...current }, modified)
      localStorage.setItem('settings', JSON.stringify(changed))
      return changed
   }, DEFAULT)

   useEffect(() => {
      const json = localStorage.getItem('settings')
      if (json) modify(JSON.parse(json))
   }, [])

   const theme = useMemo(() => settings.dark ? dark : light, [settings])

   return <CONTEXT.Provider value={[settings, modify]}>
      <ThemeProvider theme={theme}>
         {children}
      </ThemeProvider>
   </CONTEXT.Provider>
}