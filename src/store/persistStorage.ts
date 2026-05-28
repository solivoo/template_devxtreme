import type { Storage } from 'redux-persist';

/** localStorage compatible con Vite (evita fallo de import CJS de redux-persist/lib/storage). */
export const persistStorage: Storage = {
  getItem: (key) =>
    Promise.resolve(window.localStorage.getItem(key)),
  setItem: (key, value) => {
    window.localStorage.setItem(key, value);
    return Promise.resolve();
  },
  removeItem: (key) => {
    window.localStorage.removeItem(key);
    return Promise.resolve();
  },
};
