import React from 'react';

const Header = () => {
    return (
        <header style={styles.header}>
            <div style={styles.logoContainer}>
                {/* Add your logo here, can be an image or text */}
                <h1 style={styles.logo}>Cloud Storage</h1>
            </div>
            <nav style={styles.nav}>
                <a href="#" style={styles.navLink}>Home</a>
                <a href="#" style={styles.navLink}>Features</a>
                <a href="#" style={styles.navLink}>Contact</a>
            </nav>
        </header>
    );
};

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#0078D7', // Add your preferred color
        color: '#fff',
        borderBottom: '1px solid #ccc',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    logo: {
        fontSize: '20px',
        fontWeight: 'bold',
        margin: 0,
    },
    nav: {
        display: 'flex',
        gap: '15px',
    },
    navLink: {
        textDecoration: 'none',
        color: 'white',
        fontSize: '16px',
        fontWeight: '500',
        transition: 'color 0.3s',
    },
    navLinkHover: {
        color: '#ffd700',
    },
};

export default Header;
