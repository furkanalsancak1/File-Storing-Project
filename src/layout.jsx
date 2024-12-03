import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/header';
import NavBar from './components/nav-bar';


function Layout() {
    return (
        <div>
            <Header />
            <NavBar />
            <main style={{ padding: '20px' }}>
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;
