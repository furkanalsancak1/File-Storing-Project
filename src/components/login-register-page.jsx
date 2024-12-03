import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LogInRegister({ setAuthenticated }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Initialize navigation

    const handleSubmit = (e) => {
        e.preventDefault();

        // Simulate login logic
        if (email === 'user@example.com' && password === 'password123') {
            setMessage('Login successful! Redirecting...');
            setAuthenticated(true); // Update authentication state
            setTimeout(() => {
                navigate('/main-page'); // Redirect to main page
            }, 1000);
        } else {
            setMessage('Invalid email or password. Please try again.');
        }
    };

    return (
        <section style={{ maxWidth: '300px', margin: 'auto', padding: '20px', border: '1px solid #ccc' }}>
            <h2>Login</h2>
            {message && <p style={{ color: message.includes('successful') ? 'green' : 'red' }}>{message}</p>}
            <form onSubmit={handleSubmit}>
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

export default LogInRegister;
