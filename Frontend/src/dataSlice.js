import { createSlice } from '@reduxjs/toolkit';

export const dataSlice = createSlice({
  name: 'data',
  initialState: {},
  reducers: {
    passData: (state, action) => {
      return { ...action.payload };
    },
    emptyData: () => {
      return {};
    }
  }
});

export const { passData, emptyData } = dataSlice.actions;

export default dataSlice.reducer;
