import { useEffect, useRef, useState } from 'react';
import axios from './axiosConfig';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteBlog } from './blogSlice';

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
};

const Blog = ({ blog, parent, myRef }) => {
  const location = useLocation();
  const [visible, setV] = useState(false);
  const dispatch = useDispatch();
  const divRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (divRef.current) {
        const height = divRef.current.offsetHeight;
        if (document.documentElement.scrollTop > height) {
          setV(false);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      setV(false);
    };
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`/myblogs/${id}`);
      if (res.status === 200) {
        dispatch(deleteBlog(id));
        parent.current.classList.add('delPanel');
        setTimeout(() => {
          parent.current.classList.remove('delPanel');
        }, 2000);
      }
    } catch (err) {
      myRef.current.classList.add('showErr');
      setTimeout(() => {
        myRef.current.classList.remove('showErr');
      }, 3000);
    }
  };

  const date = formatDate(blog.created_at);
  const blogState = {
    title: blog.title,
    author: blog.name,
    creationDate: date,
    img: blog.img || null
  };

  return (
    <div className='blogItem' ref={divRef}>
      <Link to={`/blogs/${blog.id}`} state={blogState} className='blog'>
        <div>
          <small>{blog.name} | {date}</small>
          <h2>{blog.title}</h2>
          <p>{blog.summary}...</p>
        </div>
        {blog.img && <img src={`http://localhost:5000/public/images/${blog.img}`} alt='img' />}
      </Link>
      {location.pathname === '/myblogs' && <img className='menuicon' src='/images/icons8-menu-30.png' onClick={() => setV(prev => !prev)} alt='menu' />}
      {visible &&
        <div className='menu'>
          <Link to={`/myblogs/${blog.id}`}>Update blog</Link>
          <button onClick={() => handleDelete(blog.id)}>Delete blog</button>
        </div>}
    </div>
  );
};

export default Blog;
