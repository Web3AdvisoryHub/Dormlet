import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SpaceObject {
  id: string;
  nftId: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
}

interface Space {
  id: string;
  name: string;
  owner: string;
  isPublic: boolean;
  template: string;
  objects: SpaceObject[];
  environment: {
    skybox: string;
    lighting: string;
    ambience: string;
  };
}

interface SpaceState {
  spaces: Space[];
  currentSpace: Space | null;
  isLoading: boolean;
  error: string | null;
  editMode: boolean;
}

const initialState: SpaceState = {
  spaces: [],
  currentSpace: null,
  isLoading: false,
  error: null,
  editMode: false,
};

export const spaceSlice = createSlice({
  name: 'space',
  initialState,
  reducers: {
    fetchSpacesRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchSpacesSuccess: (state, action: PayloadAction<Space[]>) => {
      state.spaces = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    fetchSpacesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setCurrentSpace: (state, action: PayloadAction<string>) => {
      state.currentSpace = state.spaces.find(space => space.id === action.payload) || null;
    },
    createSpaceRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    createSpaceSuccess: (state, action: PayloadAction<Space>) => {
      state.spaces.push(action.payload);
      state.currentSpace = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    createSpaceFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateSpaceRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateSpaceSuccess: (state, action: PayloadAction<Space>) => {
      const index = state.spaces.findIndex(space => space.id === action.payload.id);
      if (index !== -1) {
        state.spaces[index] = action.payload;
        if (state.currentSpace && state.currentSpace.id === action.payload.id) {
          state.currentSpace = action.payload;
        }
      }
      state.isLoading = false;
      state.error = null;
    },
    updateSpaceFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    toggleEditMode: (state) => {
      state.editMode = !state.editMode;
    },
    addObjectToSpace: (state, action: PayloadAction<SpaceObject>) => {
      if (state.currentSpace) {
        state.currentSpace.objects.push(action.payload);
      }
    },
    updateObjectInSpace: (state, action: PayloadAction<SpaceObject>) => {
      if (state.currentSpace) {
        const index = state.currentSpace.objects.findIndex(obj => obj.id === action.payload.id);
        if (index !== -1) {
          state.currentSpace.objects[index] = action.payload;
        }
      }
    },
    removeObjectFromSpace: (state, action: PayloadAction<string>) => {
      if (state.currentSpace) {
        state.currentSpace.objects = state.currentSpace.objects.filter(obj => obj.id !== action.payload);
      }
    },
  },
});

export const {
  fetchSpacesRequest,
  fetchSpacesSuccess,
  fetchSpacesFailure,
  setCurrentSpace,
  createSpaceRequest,
  createSpaceSuccess,
  createSpaceFailure,
  updateSpaceRequest,
  updateSpaceSuccess,
  updateSpaceFailure,
  toggleEditMode,
  addObjectToSpace,
  updateObjectInSpace,
  removeObjectFromSpace,
} = spaceSlice.actions;

export default spaceSlice.reducer;
