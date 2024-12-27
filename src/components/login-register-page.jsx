import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LogInRegister({ setAuthenticated }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false); // For button loading state
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Show loading state

        try {
            const response = await fetch('http://localhost:5001/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            setIsLoading(false); // Remove loading state

            if (response.ok) {
                setMessage('Login successful! Redirecting...');
                setAuthenticated(true); // Update authentication state

                // Save token to local storage or session storage
                localStorage.setItem('authToken', data.token);

                setTimeout(() => {
                    navigate('/main-page'); // Redirect to main page
                }, 1000);
            } else {
                // Display error message from backend
                setMessage(data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setMessage('An error occurred. Please try again later.');
            setIsLoading(false);
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
                <button type="submit" style={{ marginTop: '10px' }} disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Log In'}
                </button>
            </form>
        </section>
    );
}

export default LogInRegister;
