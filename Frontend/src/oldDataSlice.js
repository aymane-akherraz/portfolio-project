import { createSlice } from '@reduxjs/toolkit';

export const oldDataSlice = createSlice({
  name: 'blogData',
  initialState: {},
  reducers: {
    sendData: (state, action) => {
      return { ...action.payload };
    }
  }
});
export const { sendData } = oldDataSlice.actions;

export default oldDataSlice.reducer;
