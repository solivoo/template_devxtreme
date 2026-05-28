import './setupDevextremeThemeLinks.ts';
import config from 'devextreme/core/config';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { licenseKey } from '../devextreme-license.ts';
import { App } from './App.tsx';
import './index.css';
import { DevExtremeThemeProvider } from './theme/DevExtremeThemeProvider.tsx';
import { persistor, store } from './store/store.ts';

config({ licenseKey: licenseKey });

createRoot(document.getElementById('root')!).render(
  <DevExtremeThemeProvider>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </DevExtremeThemeProvider>,
);
