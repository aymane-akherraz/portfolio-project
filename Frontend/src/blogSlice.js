import { createSlice } from '@reduxjs/toolkit';
import axios from './axiosConfig';
import { checkAuth } from './checkAuth';

const getBlogs = async () => {
  try {
    const { id } = await checkAuth();
    const blogs = await axios.get(`/myblogs/${id}`);
    return blogs.data;
  } catch (err) {
    return [];
  }
};

export const blogSlice = createSlice({
  name: 'blog',
  initialState: await getBlogs(),
  reducers: {
    fetchBlogs: (state, action) => {
      return [...action.payload];
    },
    addBlog: (state, action) => {
      return [...state, action.payload];
    },
    deleteBlog: (state, action) => {
      return state.filter(blog => blog.id !== action.payload);
    },
    editBlog: (state, action) => {
      return state.map((b) => {
        if (b.id === action.payload.id) {
          return { ...b, ...action.payload.blog };
        }
        return b;
      });
    },
    emptyBlogs: () => {
      return [];
    }
  }
});

export const { fetchBlogs, addBlog, emptyBlogs, deleteBlog, editBlog } = blogSlice.actions;

export default blogSlice.reducer;
