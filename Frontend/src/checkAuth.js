import axios from './axiosConfig';

export const checkAuth = async () => {
  try {
    const res = await axios.get('/checkAuth');
    if (res.status === 200) {
      return res.data;
    }
    return {};
  } catch (error) {
    return {};
  }
};
