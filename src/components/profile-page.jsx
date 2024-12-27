import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProfilePage() {
    const [user, setUser] = useState({ username: '', email: '' }); // User details
    const [editMode, setEditMode] = useState(false); // Toggle edit mode
    const [password, setPassword] = useState({ current: '', new: '' }); // Password change fields
    const [message, setMessage] = useState(''); // Success/error messages

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = localStorage.getItem('token'); // Get JWT token from localStorage
                const response = await axios.get('http://localhost:5001/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data.user);
            } catch (error) {
                console.error('Error fetching user details:', error.message);
                setMessage('Failed to load profile.');
            }
        };

        fetchUserDetails();
    }, []);

    // Handle edit mode input changes
    const handleUserInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    // Handle save profile changes
    const handleSaveProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                'http://localhost:5001/auth/update-profile',
                { username: user.username, email: user.email },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage('Profile updated successfully!');
            setEditMode(false); // Exit edit mode
        } catch (error) {
            console.error('Error updating profile:', error.message);
            setMessage('Failed to update profile.');
        }
    };

    // Handle password change input
    const handlePasswordInputChange = (e) => {
        const { name, value } = e.target;
        setPassword((prev) => ({ ...prev, [name]: value }));
    };

    // Handle password change submission
    const handlePasswordChange = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:5001/auth/change-password',
                { currentPassword: password.current, newPassword: password.new },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage('Password changed successfully!');
            setPassword({ current: '', new: '' }); // Clear password fields
        } catch (error) {
            console.error('Error changing password:', error.message);
            setMessage('Failed to change password.');
        }
    };

    return (
        <section style={{ maxWidth: '600px', margin: 'auto', textAlign: 'center' }}>
            <h1>Profile Page</h1>
            {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}

            <div style={{ margin: '20px 0', textAlign: 'left' }}>
                <h2>User Information</h2>
                {editMode ? (
                    <>
                        <label>
                            <p>Username</p>
                            <input
                                type="text"
                                name="username"
                                value={user.username}
                                onChange={handleUserInputChange}
                                style={{ width: '100%', marginBottom: '10px' }}
                            />
                        </label>
                        <label>
                            <p>Email</p>
                            <input
                                type="email"
                                name="email"
                                value={user.email}
                                onChange={handleUserInputChange}
                                style={{ width: '100%', marginBottom: '10px' }}
                            />
                        </label>
                        <button onClick={handleSaveProfile} style={styles.saveButton}>
                            Save
                        </button>
                        <button onClick={() => setEditMode(false)} style={styles.cancelButton}>
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <p><strong>Username:</strong> {user.username}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <button onClick={() => setEditMode(true)} style={styles.editButton}>
                            Edit Profile
                        </button>
                    </>
                )}
            </div>

            <div style={{ margin: '20px 0', textAlign: 'left' }}>
                <h2>Change Password</h2>
                <label>
                    <p>Current Password</p>
                    <input
                        type="password"
                        name="current"
                        value={password.current}
                        onChange={handlePasswordInputChange}
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
                </label>
                <label>
                    <p>New Password</p>
                    <input
                        type="password"
                        name="new"
                        value={password.new}
                        onChange={handlePasswordInputChange}
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
                </label>
                <button onClick={handlePasswordChange} style={styles.saveButton}>
                    Change Password
                </button>
            </div>
        </section>
    );
}

const styles = {
    editButton: {
        padding: '10px 20px',
        backgroundColor: '#3B82F6',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        marginRight: '10px',
    },
    saveButton: {
        padding: '10px 20px',
        backgroundColor: '#10B981',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        marginRight: '10px',
    },
    cancelButton: {
        padding: '10px 20px',
        backgroundColor: '#EF4444',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
    },
};

export default ProfilePage;
