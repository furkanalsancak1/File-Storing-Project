import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layout.jsx';
import Login from './components/login.jsx';
import Register from './components/register.jsx';
import MainPage from './components/main-page.jsx';
import ProfilePage from './components/profile-page.jsx';
import ProtectedRoute from './ProtectedRoute';

function App() {
    const [isAuthenticated, setAuthenticated] = useState(!!localStorage.getItem('token')); // Initialize based on token

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear token
        setAuthenticated(false); // Update authentication state
    };

    return (
        <BrowserRouter>
            <Routes>
                {/* Redirect root to login */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Public routes */}
                <Route
                    path="/login"
                    element={
                        isAuthenticated ? (
                            <Navigate to="/main-page" replace />
                        ) : (
                            <Login setAuthenticated={setAuthenticated} />
                        )
                    }
                />
                <Route
                    path="/register"
                    element={
                        isAuthenticated ? (
                            <Navigate to="/main-page" replace />
                        ) : (
                            <Register />
                        )
                    }
                />

                {/* Protected routes wrapped inside Layout */}
                <Route element={<Layout handleLogout={handleLogout} />}>
                    <Route
                        path="/main-page"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <MainPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile-page"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />
                </Route>

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
