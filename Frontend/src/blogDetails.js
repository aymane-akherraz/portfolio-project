import axios from './axiosConfig';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

const BlogDetails = ({ Ref }) => {
  const location = useLocation();
  const { id } = useParams();
  const blog = useRef(location.state);
  const [content, setCont] = useState(null);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  const showErr = () => {
    Ref.current.classList.add('showErr');
    setTimeout(() => {
      Ref.current.classList.remove('showErr');
    }, 3000);
  };

  const getBlog = async (id) => {
    try {
      const res = await axios.get(`/blog/${id}`);
      if (res.status === 200) {
        return res.data;
      }
    } catch (err) {
      return new Error();
    }
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        if (!location.state) {
          blog.current = await getBlog(id);
          blog.current.creationDate = formatDate(blog.current.creationDate);
        }
        const res = await axios.get(`/blogs/${id}`);
        if (res.status === 200) {
          setCont(res.data);
        }
      } catch (err) {
        showErr();
      }
    };
    fetchBlog();
    // eslint-disable-next-line
  }, [id, location.state]);

  return (
    content
      ? (
        <div className='blogDt'>
          <div className='info'>
            <h1>{blog.current.title}</h1>
            <p>Author: {blog.current.author}</p>
            <small>Published at: {blog.current.creationDate}</small>
          </div>
          <div>
            {blog.current.img && <img src={`http://localhost:5000/public/images/${blog.current.img}`} alt='img' className='blogImg' />}
          </div>
          <div className='blogCont'>
            {content.split('\n').map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
          </div>
        </div>)
      : <div className='loading' />
  );
};

export default BlogDetails;
