import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import { thunk } from 'redux-thunk';  // Named export olarak import edin

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});