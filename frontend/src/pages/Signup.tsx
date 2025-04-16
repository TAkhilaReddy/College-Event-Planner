
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import { AuthContext } from '../context/Authentication';
import '../styles/auth.css';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
           
            const response = await fetch('http://localhost:3001/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to sign up');
            }

            login(data.token);
            navigate('/dashboard'); 
        } catch (err) {
            setError((err as Error).message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='authPage'>
            <Navbar />
            <div className='authContainer'>
                <h2>Signup</h2>
                {error && <div className="error-message">{error}</div>}
                <form className='authForm' onSubmit={handleSubmit}>
                    <input 
                        type='text' 
                        placeholder='Name' 
                        required 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input 
                        type='email' 
                        placeholder='Email' 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input 
                        type='password' 
                        placeholder='Password' 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type='submit' disabled={loading}>
                        {loading ? 'Signing up...' : 'Signup'}
                    </button>
                </form>
                <p className='redirect'>Already have an account? <a href="/login">Login</a></p>
            </div>
        </div>
    );
};

export default Signup;