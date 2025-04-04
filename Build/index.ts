import { configureStore } from '@reduxjs/toolkit';
import walletReducer from './walletSlice';
import nftReducer from './nftSlice';
import spaceReducer from './spaceSlice';
import avatarReducer from './avatarSlice';
import socialReducer from './socialSlice';

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
    nft: nftReducer,
    space: spaceReducer,
    avatar: avatarReducer,
    social: socialReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['wallet/connectWalletSuccess'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.provider'],
        // Ignore these paths in the state
        ignoredPaths: ['wallet.provider'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
