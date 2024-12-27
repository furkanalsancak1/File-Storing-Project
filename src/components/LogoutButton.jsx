import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear the JWT token
        localStorage.removeItem('token');
    
        // Trigger state change for authentication
        setAuthenticated(false);
    
        // Redirect to the login page
        navigate('/login');
    };
    

    return (
        <button 
            onClick={handleLogout} 
            style={{
                padding: '10px 20px',
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
            }}
        >
            Log Out
        </button>
    );
}

export default LogoutButton;
