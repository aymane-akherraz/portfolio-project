import Navbar from './Navbar';
import Home from './blogs';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './register';
import Login from './login';
import Profile from './Profile';
import './App.css';
import BlogDetails from './blogDetails';
import Create from './createBlog';
import Myblogs from './Myblogs';
import Update from './Editblog';
import ScrollToTop from './Srollup';
import { useSelector } from 'react-redux';
import { useRef } from 'react';
import Footer from './Footer';
import About from './About';

function App () {
  const user = useSelector((state) => state.user);
  const myApp = useRef(null);

  return (
    <Router>
      <div className='App' ref={myApp}>
        <ScrollToTop />
        <Navbar Ref={myApp} />
        <Routes>
          <Route path='/' element={<Home Ref={myApp} />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/blogs/:id' element={<BlogDetails Ref={myApp} />} />
          <Route path='/blogs/create' element={<Create />} />
          <Route path='/myblogs' element={<Myblogs Ref={myApp} />} />
          <Route path='/myblogs/:id' element={user.id ? <Update Ref={myApp} /> : <Login />} />
          <Route path='/about' element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
