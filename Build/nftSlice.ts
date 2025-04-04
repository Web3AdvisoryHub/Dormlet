import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NFT {
  id: string;
  tokenId: string;
  contractAddress: string;
  chainId: number;
  name: string;
  description: string;
  image: string;
  metadata: any;
}

interface NFTState {
  nfts: NFT[];
  isLoading: boolean;
  error: string | null;
  selectedNFT: NFT | null;
}

const initialState: NFTState = {
  nfts: [],
  isLoading: false,
  error: null,
  selectedNFT: null,
};

export const nftSlice = createSlice({
  name: 'nft',
  initialState,
  reducers: {
    fetchNFTsRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchNFTsSuccess: (state, action: PayloadAction<NFT[]>) => {
      state.nfts = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    fetchNFTsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    selectNFT: (state, action: PayloadAction<string>) => {
      state.selectedNFT = state.nfts.find(nft => nft.id === action.payload) || null;
    },
    clearSelectedNFT: (state) => {
      state.selectedNFT = null;
    },
  },
});

export const {
  fetchNFTsRequest,
  fetchNFTsSuccess,
  fetchNFTsFailure,
  selectNFT,
  clearSelectedNFT,
} = nftSlice.actions;

export default nftSlice.reducer;
