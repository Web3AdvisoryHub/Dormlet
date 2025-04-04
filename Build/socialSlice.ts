import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  walletAddress: string;
  username: string;
  avatarId: string;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: number;
  spaceId: string;
}

interface SocialState {
  users: User[];
  onlineUsers: string[]; // Array of user IDs
  friends: string[]; // Array of user IDs
  pendingFriendRequests: { from: string; to: string }[];
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SocialState = {
  users: [],
  onlineUsers: [],
  friends: [],
  pendingFriendRequests: [],
  messages: [],
  isLoading: false,
  error: null,
};

export const socialSlice = createSlice({
  name: 'social',
  initialState,
  reducers: {
    fetchUsersRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchUsersSuccess: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    fetchUsersFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.onlineUsers = action.payload;
    },
    fetchFriendsRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchFriendsSuccess: (state, action: PayloadAction<string[]>) => {
      state.friends = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    fetchFriendsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    sendFriendRequestRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    sendFriendRequestSuccess: (state, action: PayloadAction<{ from: string; to: string }>) => {
      state.pendingFriendRequests.push(action.payload);
      state.isLoading = false;
      state.error = null;
    },
    sendFriendRequestFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    acceptFriendRequestRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    acceptFriendRequestSuccess: (state, action: PayloadAction<{ from: string; to: string }>) => {
      state.pendingFriendRequests = state.pendingFriendRequests.filter(
        req => !(req.from === action.payload.from && req.to === action.payload.to)
      );
      if (!state.friends.includes(action.payload.from)) {
        state.friends.push(action.payload.from);
      }
      state.isLoading = false;
      state.error = null;
    },
    acceptFriendRequestFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    rejectFriendRequest: (state, action: PayloadAction<{ from: string; to: string }>) => {
      state.pendingFriendRequests = state.pendingFriendRequests.filter(
        req => !(req.from === action.payload.from && req.to === action.payload.to)
      );
    },
    fetchMessagesRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchMessagesSuccess: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    fetchMessagesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
  },
});

export const {
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
  updateOnlineUsers,
  fetchFriendsRequest,
  fetchFriendsSuccess,
  fetchFriendsFailure,
  sendFriendRequestRequest,
  sendFriendRequestSuccess,
  sendFriendRequestFailure,
  acceptFriendRequestRequest,
  acceptFriendRequestSuccess,
  acceptFriendRequestFailure,
  rejectFriendRequest,
  fetchMessagesRequest,
  fetchMessagesSuccess,
  fetchMessagesFailure,
  addMessage,
} = socialSlice.actions;

export default socialSlice.reducer;
