import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AvatarCustomization {
  head: string;
  body: string;
  accessories: string[];
  colors: {
    skin: string;
    hair: string;
    outfit: string;
  };
}

interface AvatarState {
  customization: AvatarCustomization;
  isLoading: boolean;
  error: string | null;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  animation: string;
}

const initialState: AvatarState = {
  customization: {
    head: 'default',
    body: 'default',
    accessories: [],
    colors: {
      skin: '#F5D0A9',
      hair: '#6E2C00',
      outfit: '#3498DB',
    },
  },
  isLoading: false,
  error: null,
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  animation: 'idle',
};

export const avatarSlice = createSlice({
  name: 'avatar',
  initialState,
  reducers: {
    updateAvatarCustomization: (state, action: PayloadAction<Partial<AvatarCustomization>>) => {
      state.customization = { ...state.customization, ...action.payload };
    },
    saveAvatarRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    saveAvatarSuccess: (state) => {
      state.isLoading = false;
      state.error = null;
    },
    saveAvatarFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateAvatarPosition: (state, action: PayloadAction<{ x: number; y: number; z: number }>) => {
      state.position = action.payload;
    },
    updateAvatarRotation: (state, action: PayloadAction<{ x: number; y: number; z: number }>) => {
      state.rotation = action.payload;
    },
    setAvatarAnimation: (state, action: PayloadAction<string>) => {
      state.animation = action.payload;
    },
  },
});

export const {
  updateAvatarCustomization,
  saveAvatarRequest,
  saveAvatarSuccess,
  saveAvatarFailure,
  updateAvatarPosition,
  updateAvatarRotation,
  setAvatarAnimation,
} = avatarSlice.actions;

export default avatarSlice.reducer;
