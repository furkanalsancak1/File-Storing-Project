import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
    return (
        <nav style={{ padding: '10px', backgroundColor: '#f0f0f0', display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <Link
                to="/main-page"
                style={{ textDecoration: 'none', padding: '10px', backgroundColor: '#007BFF', color: '#fff', borderRadius: '4px' }}
            >
                Home
            </Link>
            <Link
                to="/profile-page"
                style={{ textDecoration: 'none', padding: '10px', backgroundColor: '#007BFF', color: '#fff', borderRadius: '4px' }}
            >
                Profile
            </Link>
        </nav>
    );
}

export default NavBar;
