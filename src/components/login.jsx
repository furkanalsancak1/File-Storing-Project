import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setAuthenticated }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5001/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage('Login successful! Redirecting...');
                setAuthenticated(true);
                localStorage.setItem('token', data.token); // Save JWT token
                setTimeout(() => {
                    navigate('/main-page');
                }, 1000);
            } else {
                setMessage('Invalid email or password. Please try again.');
            }
        } catch (err) {
            console.error('Error during login:', err.message);
            setMessage('An error occurred. Please try again later.');
        }
    };

    return (
        <section style={{ maxWidth: '300px', margin: 'auto', padding: '20px', border: '1px solid #ccc' }}>
            <h2>Login</h2>
            {message && <p style={{ color: message.includes('successful') ? 'green' : 'red' }}>{message}</p>}
            <form onSubmit={handleLogin}>
                <label>
                    <p>Email</p>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <label>
                    <p>Password</p>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <button type="submit" style={{ marginTop: '10px' }}>Log In</button>
            </form>
        </section>
    );
}

export default Login;
