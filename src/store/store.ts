import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { authApi, authSlice } from './auth';
import { questApi, questSlice } from './quest';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistCombineReducers } from 'redux-persist';
import { roomApi } from './room';
import { commentApi } from './comment';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['authApi', 'questApi', 'roomApi', 'commentApi']
};

const persistedReducer = persistCombineReducers(persistConfig, {
  auth: authSlice,
  quest: questSlice,
  [authApi.reducerPath]: authApi.reducer,
  [questApi.reducerPath]: questApi.reducer,
  [roomApi.reducerPath]: roomApi.reducer,
  [commentApi.reducerPath]: commentApi.reducer
});

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    }).concat(
      authApi.middleware,
      questApi.middleware,
      commentApi.middleware,
      roomApi.middleware
    )
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
