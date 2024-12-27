import React, { useState } from 'react';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5001/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage('Registration successful! You can now log in.');
            } else {
                setMessage(data.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            console.error('Error during registration:', err.message);
            setMessage('An error occurred. Please try again later.');
        }
    };

    return (
        <section style={{ maxWidth: '300px', margin: 'auto', padding: '20px', border: '1px solid #ccc' }}>
            <h2>Register</h2>
            {message && <p style={{ color: message.includes('successful') ? 'green' : 'red' }}>{message}</p>}
            <form onSubmit={handleRegister}>
                <label>
                    <p>Username</p>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>
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
                <button type="submit" style={{ marginTop: '10px' }}>Register</button>
            </form>
        </section>
    );
}

export default Register;
