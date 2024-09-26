import { useRef, useState } from 'react';
import axios from './axiosConfig';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getUser } from './userSlice';

const Signup = () => {
  const navigate = useNavigate();
  const userData = useRef({});
  const emailRe = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z]+)*$/;
  const pwdRe = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#+-?&:;<>,./~_=|(){}^])[A-Za-z\d@$!%*#+\-?&:;<>,./~_=|(){}^]{6,30}$/;
  const [err, setErr] = useState(false);
  const [err2, setErr2] = useState(false);
  const [req, setReq] = useState(false);
  const [spin, setSpin] = useState(false);
  const [visible, setVisible] = useState(false);
  const serErr = useRef('');
  const dispatch = useDispatch();

  const handleUserData = (e) => {
    if (e.target.name === 'email') {
      if (e.target.value && !emailRe.test(e.target.value)) {
        setErr(true);
      } else {
        userData.current[e.target.name] = e.target.value;
        setErr(false);
      }
    } else if (e.target.name === 'password') {
      if (e.target.value && !pwdRe.test(e.target.value)) {
        setErr2(true);
      } else {
        userData.current[e.target.name] = e.target.value;
        setErr2(false);
      }
    } else {
      userData.current[e.target.name] = e.target.value;
    }
    setReq(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    serErr.current = '';
    if (!userData.current.name || !userData.current.email || !userData.current.password) {
      setReq(true);
    } else {
      setReq(false);
      setSpin(true);
      axios.post('/signup', userData.current).then((res) => {
        if (res.status === 200) {
          setSpin(false);
          dispatch(getUser(res.data));
          navigate('/');
        }
      }).catch((err) => {
        serErr.current = err.response.data;
        setSpin(false);
        setReq(true);
      });
    }
  };
  return (
    <div className='form'>
      <h1>Welcome to Blogger !</h1>
      {req && <p className='red'> {serErr.current ? serErr.current : 'All fields are required !'} </p>}
      <form onSubmit={handleSubmit}>
        <div className='field'>
          <input type='text' name='name' onBlur={handleUserData} placeholder='Name' />
        </div>
        <div className='field'>
          <input type='email' name='email' onBlur={handleUserData} placeholder='Email' />
          {err && <small>Invalid email address !</small>}
        </div>
        <div className='field'>
          <input type={visible ? 'text' : 'password'} name='password' onBlur={handleUserData} placeholder='Password (6 characters minimum)' />
          <img onClick={() => setVisible(!visible)} src={visible ? '/images/icons8-visible-24.png' : '/images/icons8-invisible-24.png'} alt='eye' className='eye' />
          {err2 && <small>At least 6 characters (1 letter, 1 number, 1 special character)</small>}
        </div>
        <button disabled={spin && true} style={spin ? { cursor: 'not-allowed', opacity: 0.8 } : {}} className='signUp'>Sign up
          <span className={spin ? 'spin' : ''} />
        </button>
        <p className='btLink'>Already a member? <Link to='/login'>Log in</Link></p>
      </form>
    </div>
  );
};

export default Signup;
