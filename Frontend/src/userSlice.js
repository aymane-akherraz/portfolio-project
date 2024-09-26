import { createSlice } from '@reduxjs/toolkit';
import { checkAuth } from './checkAuth';

export const userSlice = createSlice({
  name: 'user',
  initialState: await checkAuth(),
  reducers: {
    getUser: (state, action) => {
      return { ...state, ...action.payload };
    },
    emptyUser: () => {
      return {};
    }
  }
});

export const { getUser, emptyUser } = userSlice.actions;

export default userSlice.reducer;
