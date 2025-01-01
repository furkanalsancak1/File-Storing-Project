import React from 'react';

const Header = () => {
    console.log(logo); // Debug the path to ensure it resolves correctly
    return (
        <header style={styles.header}>
            <div style={styles.logoContainer}>
            
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
    logoImage: {
        width: '40px',
        height: '40px',
        marginRight: '10px',
        borderRadius: '50%', // Optional for circular logos
    }
};

export default Header;