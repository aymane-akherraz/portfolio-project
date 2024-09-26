import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { emptyData, passData } from './dataSlice';
import { emptyUser } from './userSlice';
import { emptyBlogs } from './blogSlice';
import axios from './axiosConfig';
import { Navigate } from 'react-router-dom';

const Create = () => {
  let lines = '';
  const blogData = useRef({});
  const dispatch = useDispatch();
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const r = await axios.get('/checkauth');
        if (r.status === 200) {
          setIsAuth(true);
        }
      } catch (err) {
        setIsAuth(false);
        dispatch(emptyUser());
        dispatch(emptyBlogs());
      }
      dispatch(emptyData());
    };
    checkAuth();
  }, [dispatch]);

  const handleInput = (event) => {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  const getTitle = (e) => {
    blogData.current.title = e.target.value;
    dispatch(passData((blogData.current)));
  };

  const getimg = (e) => {
    if (e.target.files[0] && e.target.files[0].type.startsWith('image/')) {
      blogData.current.img = e.target.files[0];
      dispatch(passData((blogData.current)));
    }
  };

  const getLines = (e) => {
    lines = e.target.value.slice(0, 255);
    blogData.current.summary = lines;
    blogData.current.content = e.target.value;
    dispatch(passData((blogData.current)));
  };

  if (isAuth === null) {
    return <div className='loading' />;
  }

  return (
    isAuth
      ? (
        <div className='contentSect create'>
          <div className='titleCont'>
            <textarea rows={1} onInput={handleInput} autoFocus name='title' className='title' placeholder='Title' onBlur={getTitle} />
            <input type='file' accept='image/*' id='file' name='img' onChange={getimg} />
            <label htmlFor='file' title='Add image' className='file' />
          </div>
          <textarea onBlur={getLines} onInput={handleInput} placeholder='Tell your story...' name='content' className='content' />
        </div>)
      : (
        <Navigate to='/login' />
        )
  );
};

export default Create;
