import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/header';
import NavBar from './components/nav-bar';
import LogoutButton from './components/LogoutButton'; // Import LogoutButton component

function Layout() {
    return (
        <div>
            {/* Header Section */}
            <header style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '10px 20px', 
                backgroundColor: '#3B82F6', 
                color: '#FFFFFF' 
            }}>
                <h1 style={{ margin: 0 }}>Cloud Storage</h1>
                <LogoutButton /> {/* Add the LogoutButton */}
            </header>

            {/* Navigation Section */}
            <nav style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '20px', 
                padding: '10px', 
                backgroundColor: '#E5E7EB' 
            }}>
                <NavBar />
            </nav>

            {/* Main Content */}
            <main style={{ padding: '20px' }}>
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;
