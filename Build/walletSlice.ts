import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
  isConnecting: boolean;
  error: string | null;
}

const initialState: WalletState = {
  address: null,
  isConnected: false,
  chainId: null,
  isConnecting: false,
  error: null,
};

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    connectWalletRequest: (state) => {
      state.isConnecting = true;
      state.error = null;
    },
    connectWalletSuccess: (state, action: PayloadAction<{ address: string; chainId: number }>) => {
      state.isConnected = true;
      state.address = action.payload.address;
      state.chainId = action.payload.chainId;
      state.isConnecting = false;
      state.error = null;
    },
    connectWalletFailure: (state, action: PayloadAction<string>) => {
      state.isConnected = false;
      state.isConnecting = false;
      state.error = action.payload;
    },
    disconnectWallet: (state) => {
      state.isConnected = false;
      state.address = null;
      state.chainId = null;
      state.error = null;
    },
    updateChainId: (state, action: PayloadAction<number>) => {
      state.chainId = action.payload;
    },
  },
});

export const {
  connectWalletRequest,
  connectWalletSuccess,
  connectWalletFailure,
  disconnectWallet,
  updateChainId,
} = walletSlice.actions;

export default walletSlice.reducer;
