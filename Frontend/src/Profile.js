import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import axios from './axiosConfig';
import { emptyUser, getUser } from './userSlice';
import { checkAuth } from './checkAuth';
import { Navigate } from 'react-router-dom';
import { emptyBlogs } from './blogSlice';
import { emptyData } from './dataSlice';

const Profile = () => {
  const [isAuth, setIsAuth] = useState(null);
  const user = useSelector((state) => state.user);
  const userData = useRef({ name: user.name, email: user.email });
  const [req, setReq] = useState(false);
  const [spin, setSpin] = useState(false);
  const serMsg = useRef('');
  const mesCol = useRef('red');
  const myDiv = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuthentication = async () => {
      const usr = await checkAuth();
      if (JSON.stringify(usr) === '{}') {
        dispatch(emptyUser());
        dispatch(emptyBlogs());
        dispatch(emptyData());
        setIsAuth(false);
      } else {
        setIsAuth(true);
      }
    };
    checkAuthentication();
  }, [dispatch]);

  const handleUserData = (e) => {
    userData.current[e.target.name] = e.target.value;
    setReq(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    serMsg.current = '';
    mesCol.current = 'red';
    if (userData.current.name === '' || userData.current.email === '') {
      setReq(true);
    } else {
      setSpin(true);
      if (userData.current.name === user.name) {
        delete userData.current.name;
      }
      if (userData.current.email === user.email) {
        delete userData.current.email;
      }
      if (userData.current.name || userData.current.email) {
        try {
          const res = await axios.put(`/profile/update/${user.id}`, userData.current);
          if (res.status === 200) {
            mesCol.current = 'green';
          } else {
            mesCol.current = 'red';
          }
          serMsg.current = res.data;
          dispatch(getUser(userData.current));
        } catch (err) {
          serMsg.current = err.response.data;
        }
        setSpin(false);
        setReq(true);
      } else {
        setSpin(false);
        myDiv.current.classList.add('showPanel');
        setTimeout(() => {
          myDiv.current.classList.remove('showPanel');
        }, 3000);
      }
    }
  };
  if (isAuth === null) {
    return <div className='loading' />;
  }
  return (
    isAuth
      ? (
        <div className='form' ref={myDiv}>
          <h1>Hi {user.name}!</h1>
          {req && <p className={mesCol.current}>{serMsg.current ? serMsg.current : 'All fields are required !'} </p>}
          <form onSubmit={handleSubmit}>
            <label htmlFor='name'>Name:</label>
            <div className='field'>
              <input type='text' name='name' id='name' onBlur={handleUserData} defaultValue={user.name} />
            </div>
            <label htmlFor='email'>Email:</label>
            <div className='field'>
              <input type='email' name='email' id='email' onBlur={handleUserData} defaultValue={user.email} />
            </div>
            <button style={spin ? { cursor: 'not-allowed', opacity: 0.8 } : {}} disabled={spin} className='signUp'>Update
              <span className={spin ? 'spin' : ''} />
            </button>
          </form>
        </div>
        )
      : (
        <Navigate to='/login' />
        )
  );
};

export default Profile;
