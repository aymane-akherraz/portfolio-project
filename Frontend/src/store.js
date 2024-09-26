import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import blogReducer from './blogSlice';
import dataReducer from './dataSlice';
import oldDataReducer from './oldDataSlice';

export const store = configureStore({
  reducer: { user: userReducer, blog: blogReducer, data: dataReducer, blogData: oldDataReducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
});
