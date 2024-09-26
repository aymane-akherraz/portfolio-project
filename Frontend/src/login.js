import { useDispatch } from 'react-redux';
import { useRef, useState } from 'react';
import axios from './axiosConfig';
import { Link, useNavigate } from 'react-router-dom';
import { getUser } from './userSlice';

const Login = () => {
  const userData = useRef({});
  const [req, setReq] = useState(false);
  const [spin, setSpin] = useState(false);
  const [visible, setVisible] = useState(false);
  const serErr = useRef('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleUserData = (e) => {
    userData.current[e.target.name] = e.target.value;
    setReq(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    serErr.current = '';
    if (!userData.current.email || !userData.current.password) {
      setReq(true);
    } else {
      setReq(false);
      setSpin(true);
      axios.post('/login', userData.current).then((res) => {
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
      <h1>Welcome Back !</h1>
      {req && <p className='red'>{serErr.current ? serErr.current : 'All fields are required !'}</p>}
      <form onSubmit={handleSubmit}>
        <div className='field'>
          <input type='email' name='email' onBlur={handleUserData} placeholder='Email' />
        </div>
        <div className='field'>
          <input type={visible ? 'text' : 'password'} name='password' onBlur={handleUserData} placeholder='Password' />
          <img onClick={() => setVisible(!visible)} src={visible ? '/images/icons8-visible-24.png' : '/images/icons8-invisible-24.png'} alt='eye' className='eye' />
        </div>
        <button disabled={spin && true} style={spin ? { cursor: 'not-allowed', opacity: 0.8 } : {}} className='signUp'>Log in
          <span className={spin ? 'spin' : ''} />
        </button>
        <p className='btLink'>Don't have an account? <Link to='/signup'>Sign up</Link></p>
      </form>
    </div>
  );
};

export default Login;
