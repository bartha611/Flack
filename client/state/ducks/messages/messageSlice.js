import { createSlice } from "@reduxjs/toolkit";
import { updateProfile } from "../common";

const initialState = {
  loading: false,
  messages: [],
  cursor: null,
  error: false,
};

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    loadMessage(state) {
      state.loading = true;
      state.error = false;
    },
    createMessage(state, action) {
      state.loading = false;
      state.messages = [...state.messages, action.payload.message];
    },
    socketCreateMessage(state, action) {
      state.messages = [...state.messages, action.payload.message];
    },
    readMessage(state, action) {
      state.loading = false;
      state.cursor = action.payload.cursor;
      state.messages = action.payload.messages;
    },
    paginateMessage(state, action) {
      state.loading = false;
      state.cursor = action.payload.cursor;
      state.messages = [...action.payload.messages, ...state.messages];
    },
    updateMessage(state, action) {
      state.loading = false;
      state.messages = state.messages.map((message) => {
        return message.id === action.payload.id ? action.payload : message;
      });
    },
    deleteMessage(state, action) {
      state.loading = false;
      state.messages.filter((message) => message.id !== action.payload.id);
    },
    errorMessage(state) {
      state.loading = false;
      state.error = true;
    },
  },
  extraReducers: {
    [updateProfile]: (state, action) => {
      state.messages.map((message) => {
        message.user =
          message.user.id === action.payload.profile.id
            ? action.payload.profile
            : message.user;
        return message;
      });
    },
  },
});

export const {
  loadMessage,
  readMessage,
  paginateMessage,
  createMessage,
  socketCreateMessage,
  updateMessage,
  deleteMessage,
  errorMessage,
} = messageSlice.actions;
export default messageSlice.reducer;
