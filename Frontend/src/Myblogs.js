import { useDispatch, useSelector } from 'react-redux';
import Blog from './blog';
import axios from './axiosConfig';
import { emptyUser } from './userSlice';
import { emptyBlogs, fetchBlogs } from './blogSlice';
import { emptyData } from './dataSlice';
import { useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';

const Myblogs = ({ Ref }) => {
  const user = useSelector((state) => state.user);
  const blogs = useSelector((state) => state.blog);
  const [isAuth, setIsAuth] = useState(null);
  const dispatch = useDispatch();
  const myDiv = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/myblogs/${user.id}`);
        if (res.status === 200) {
          dispatch(fetchBlogs(res.data));
          setIsAuth(true);
        }
      } catch (error) {
        if (error.response.status === 401) {
          dispatch(emptyUser());
          dispatch(emptyBlogs());
          dispatch(emptyData());
          setIsAuth(false);
        } else {
          Ref.current.classList.add('showErr');
          setTimeout(() => {
            Ref.current.classList.remove('showErr');
          }, 3000);
        }
      }
    };
    fetchData();
  }, [dispatch, user.id, Ref]);

  if (isAuth === null) {
    return <div className='loading' />;
  }

  return (
    isAuth
      ? (
        <div className='blogs' ref={myDiv}>
          <h1>My blogs</h1>
          {
            blogs.map((e) => (
              <Blog key={e.id} blog={e} parent={myDiv} />
            ))
        }
        </div>)
      : (
        <Navigate to='/login' />
        )
  );
};

export default Myblogs;
