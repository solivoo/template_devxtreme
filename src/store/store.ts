import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
import {
  bindHttpStatusToStore,
  equipmentSheetSlice,
} from './equipmentSheetSlice.ts';
import { persistStorage } from './persistStorage.ts';
import { practiceSlice } from './practiceSlice.ts';

const equipmentSheetPersistConfig = {
  key: 'equipmentSheet',
  storage: persistStorage,
  whitelist: ['data'],
};

const rootReducer = combineReducers({
  practice: practiceSlice.reducer,
  equipmentSheet: persistReducer(
    equipmentSheetPersistConfig,
    equipmentSheetSlice.reducer,
  ),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

bindHttpStatusToStore(store.dispatch);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
