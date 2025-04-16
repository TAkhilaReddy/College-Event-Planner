import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import '../styles/auth.css';
import { AuthContext } from '../context/Authentication';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch("http://localhost:3001/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }
            login(data.token);
            navigate('/dashboard');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='authPage'>
            <Navbar />
            <div className='authContainer'>
                <h2>Welcome Back!</h2>
                <p className="authSubtitle">Log in to continue managing your events and goals.</p>
                {error && <div className="error-message">{error}</div>}
                <form className='authForm' onSubmit={handleSubmit}>
                    <input
                        type='email'
                        placeholder='Enter your email'
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type='password'
                        placeholder='Enter your password'
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type='submit' disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className='redirect'>Don't have an account? <a href="/signup">Sign up</a></p>
            </div>
        </div>
    )
};

export default Login;