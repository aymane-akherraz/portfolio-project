import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from './axiosConfig';
import { emptyData, passData } from './dataSlice';
import { sendData } from './oldDataSlice';

const Update = ({ Ref }) => {
  const blogs = useSelector((state) => state.blog);
  const { id } = useParams();
  const [blog] = blogs.filter(blog => blog.id === parseInt(id));
  const [content, setCont] = useState(null);
  const blTitle = useRef(null);
  const blCont = useRef(null);
  let lines = '';
  const blogDt = useRef({});
  const dispatch = useDispatch();

  const handleInput = (event) => {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get(`/blogs/${id}`);
        if (res.status === 200) {
          blTitle.current.style.height = blTitle.current.scrollHeight + 'px';
          setCont(res.data);
        }
      } catch (err) {
        Ref.current.classList.add('showErr');
        setTimeout(() => {
          Ref.current.classList.remove('showErr');
        }, 3000);
      }
    };
    fetchContent();
  }, [id, Ref]);

  useEffect(() => {
    if (blCont.current) {
      blCont.current.style.height = blCont.current.scrollHeight + 'px';
    }
    dispatch(emptyData());
    dispatch(sendData({ id, title: blog.title, content, summary: blog.summary }));
    blogDt.current.content = content;
  }, [content, dispatch, id, blog.title, blog.summary]);

  const getTitle = (e) => {
    blogDt.current.title = e.target.value;
    dispatch(passData((blogDt.current)));
  };

  const getLines = (e) => {
    lines = e.target.value.slice(0, 255);
    blogDt.current.summary = lines;
    blogDt.current.content = e.target.value;
    dispatch(passData((blogDt.current)));
  };

  return (
    <div className='contentSect edit'>
      <textarea name='title' autoFocus onInput={handleInput} ref={blTitle} className='title' placeholder='Title' onBlur={getTitle} defaultValue={blog.title} />
      {content ? <textarea ref={blCont} onBlur={getLines} onInput={handleInput} placeholder='Tell your story...' name='content' className='content' defaultValue={content} /> : <div className='loading' />}
    </div>
  );
};

export default Update;
