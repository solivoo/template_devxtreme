import { useCallback, useLayoutEffect, useMemo, useState, type ReactNode } from 'react';
import themes from 'devextreme/ui/themes';
import { DevExtremeThemeContext } from './devExtremeThemeContext';
import type { DevExtremeThemeMode } from './types';

const STORAGE_KEY = 'devextreme-theme-mode';

//Funcion para obtener el modo inicial
function initialMode(): DevExtremeThemeMode {
  // Esta app está diseñada para una vista clara fija (alineada con Figma).
  return 'light';
}

//Interfaz para las props del componente
interface DevExtremeThemeProviderProps {
  children: ReactNode;
}

//Componente para proporcionar el contexto de DevExtremeTheme
export function DevExtremeThemeProvider({ children }: DevExtremeThemeProviderProps) {
  // Estado para el modo actual light o dark
  const [mode, setModeState] = useState<DevExtremeThemeMode>(initialMode);

  useLayoutEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, 'light');
    } catch {
      /* ignore */
    }
  }, []);

  //Funcion para establecer el modo actual
  const setMode = useCallback((next: DevExtremeThemeMode) => {
    setModeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  //Funcion para alternar el modo actual
  const toggleMode = useCallback(() => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  }, [mode, setMode]);

  //Efecto para aplicar el tema actual
  useLayoutEffect(() => {
    const themeName = mode === 'dark' ? 'material.blue.dark' : 'material.blue.light';
    themes.current(themeName);
    document.documentElement.classList.toggle('theme-dark', mode === 'dark');
  }, [mode]);

  //Valor para el contexto
  const value = useMemo(() => ({ mode, setMode, toggleMode }), [mode, setMode, toggleMode]);

  //Devolver el contexto
  return <DevExtremeThemeContext.Provider value={value}>{children}</DevExtremeThemeContext.Provider>;
}
