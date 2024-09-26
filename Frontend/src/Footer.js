import { Link, useLocation } from 'react-router-dom';
import './footer.css';
const Footer = () => {
  const d = new Date();
  const location = useLocation();

  return (
    <footer>
      <div className='about'>
        &copy; {d.getFullYear()} <b>Blogger</b>
        {location.pathname !== '/about' && <Link to='/about'>About</Link>}
      </div>
    </footer>
  );
};

export default Footer;
