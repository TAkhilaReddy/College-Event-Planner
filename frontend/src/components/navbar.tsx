import { useContext } from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css';
import { AuthContext } from '../context/Authentication';

const Navbar = () => {
    const { isAuthenticated, logout } = useContext(AuthContext);

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/" className="logo">Event Planner</Link>
            </div>
            <ul className="navbar-nav">
                {isAuthenticated ? (
                    <>
                        <li><Link to="/login">Dashboard</Link></li>
                        <li><button onClick={logout} className="nav-button">Logout</button></li>
                    </>
                ) : (
                    <>
                    <div className='nav-links'>
                    <li ><Link to="/login">Login</Link></li>
                    <li><Link to="/signup">Signup</Link></li>
                    </div>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
