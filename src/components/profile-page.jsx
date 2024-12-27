import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProfilePage() {
    const [user, setUser] = useState(null); // User details
    const [loadingMessage, setLoadingMessage] = useState(''); // Loading message
    const [errorMessage, setErrorMessage] = useState(''); // Error message

    useEffect(() => {
        const fetchUserDetails = async () => {
            setLoadingMessage('Loading profile...');
            try {
                const token = localStorage.getItem('token'); // Get JWT token from localStorage
                const response = await axios.get('http://localhost:5001/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data.user); // Set user details
                setLoadingMessage('');
            } catch (error) {
                console.error('Error fetching user details:', error.response?.data || error.message);
                setErrorMessage('Failed to load profile. Please try again.');
                setLoadingMessage('');
            }
        };

        fetchUserDetails();
    }, []);

    if (loadingMessage) return <p>{loadingMessage}</p>;

    if (errorMessage) return <p style={{ color: 'red' }}>{errorMessage}</p>;

    return (
        <section style={{ maxWidth: '600px', margin: 'auto', textAlign: 'center' }}>
            <h1>Profile Page</h1>
            <div style={{ margin: '20px 0', textAlign: 'left' }}>
                <h2>User Information</h2>
                <p><strong>Username:</strong> {user?.username}</p>
                <p><strong>Email:</strong> {user?.email}</p>
            </div>
        </section>
    );
}

export default ProfilePage;
