import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../Logo/logo.jpeg'; // Import the logo

function Welcome() {
    const navigate = useNavigate();

    return (
        <section style={styles.container}>
            {/* Add Logo */}
            <img src={logo} alt="App Logo" style={styles.logo} />

            {/* Title and Subtitle */}
            <h1 style={styles.title}>Welcome to Our App</h1>
            <p style={styles.subtitle}>Your gateway to organization and productivity.</p>

            {/* Buttons */}
            <div style={styles.buttonContainer}>
                <button
                    style={styles.button}
                    onClick={() => navigate('/login')} // Navigate to login page
                >
                    Login
                </button>
                <button
                    style={styles.button}
                    onClick={() => navigate('/register')} // Navigate to register page
                >
                    Create Account
                </button>
            </div>
        </section>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
        fontFamily: 'Inter, sans-serif',
        textAlign: 'center',
    },
    logo: {
        width: '100px', // Set the width of the logo
        height: '100px', // Set the height of the logo
        marginBottom: '20px', // Add space below the logo
        borderRadius: '50%', // Make the logo circular (optional)
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Add shadow for a nice effect
    },
    title: {
        fontSize: '36px',
        fontWeight: 'bold',
        marginBottom: '16px',
        color: '#1F2937',
    },
    subtitle: {
        fontSize: '16px',
        color: '#64748B',
        marginBottom: '24px',
    },
    buttonContainer: {
        display: 'flex',
        gap: '16px',
    },
    button: {
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#FFFFFF',
        backgroundColor: '#3B82F6',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
};

export default Welcome;
