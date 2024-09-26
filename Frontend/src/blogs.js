import './blogs.css';
import React, { useEffect, useRef, useState } from 'react';
import axios from './axiosConfig';
import { useDispatch } from 'react-redux';
import { emptyUser } from './userSlice';
import { Link, useLocation } from 'react-router-dom';
import Blog from './blog';
import { emptyBlogs } from './blogSlice';
import { emptyData } from './dataSlice';

const Home = ({ Ref }) => {
  const [blogs, setBlogs] = useState(null);
  const [isAuth, setIsAuth] = useState(null);
  const dispatch = useDispatch();
  const myHeader = useRef(null);
  const myP = useRef(null);
  const myBtn = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const r = await axios.get('/checkauth');
        if (r.status === 200) {
          setIsAuth(true);
        }
      } catch (err) {
        setIsAuth(false);
        dispatch(emptyUser());
        dispatch(emptyBlogs());
        dispatch(emptyData());
      }

      try {
        const res = await axios.get('/');
        setBlogs(res.data);
      } catch (err) {
        Ref.current.classList.add('showErr');
        setTimeout(() => {
          Ref.current.classList.remove('showErr');
        }, 3000);
      }
    };
    fetchData();
  }, [dispatch, location.search, Ref]);

  useEffect(() => {
    if (myHeader.current) {
      myHeader.current.classList.add('show');
    }
    if (myP.current) {
      myP.current.classList.add('show');
    }
    if (myBtn.current) {
      myBtn.current.classList.add('show');
    }
  }, [blogs]);

  if (isAuth === null) {
    return <div className='loading' />;
  }

  return (
    <div className='parent'>
      {!isAuth && (
        <>
          <div className='landing'>
            <div className='mask'>
              <div className='content'>
                <h1 ref={myHeader}>Stay creative</h1>
                <p ref={myP}>Create a unique and beautiful blog easily</p>
                <Link ref={myBtn} className='link signIn main' style={{ padding: '15px 30px', borderRadius: '25px' }} to='/signup'>Create your blog</Link>
              </div>
            </div>
          </div>
          <div className='features'>
            <div className='feature'>
              <div>
                <img className='createImg' src='/images/create.png' alt='create blog page' />
              </div>
              <div className='desc'>
                <h1>Create your blog easily</h1>
                <p>With our simple and friendly interface, creating your blog is a breeze.
                  Whether you're a seasoned writer or just starting out, our intuitive design makes
                  it easy for anyone to publish content.
                </p>
              </div>
            </div>
            <div className='feature discover'>
              <div className='desc'>
                <h1>Discover amazing stories</h1>
                <p>Explore thought-provoking articles, personal experiences, and expert insights,
                  all in one place. Stay updated with fresh content and uncover the stories that resonate with you.
                </p>
              </div>
              <div>
                <img src='/images/recent_blogs.png' alt='blogs page' />
              </div>
            </div>
            <div className='feature'>
              <div>
                <img src='/images/manage_blogs.png' alt='My blogs page' />
              </div>
              <div className='desc'>
                <h1>Manage your blogs easily</h1>
                <p>Whether you need to tweak a few details or remove a post entirely, managing your blog has never been easier.
                  Our intuitive interface allows you to make changes quickly, keeping your focus on creating great content.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
      {blogs
        ? (
          <div className='blogs'>
            <h1>Recent Blogs</h1>
            {blogs.map((e) => (
              <Blog key={e.id} blog={e} myRef={Ref} />
            ))}
          </div>
          )
        : (
          <div className='loading' />
          )}
    </div>
  );
};

export default Home;
