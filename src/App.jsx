import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layout.jsx';
import LogInRegister from './components/login-register-page.jsx';
import MainPage from './components/main-page.jsx';
import ProfilePage from './components/profile-page.jsx';
import ProtectedRoute from './ProtectedRoute';

function App() {
    const [isAuthenticated, setAuthenticated] = useState(false); // Dynamic authentication state

    return (
        <BrowserRouter>
            <Routes>
                {/* Redirect root to login */}
                <Route path="/" element={<Navigate to="/login" />} />

                {/* Public route for login */}
                <Route path="/login" element={<LogInRegister setAuthenticated={setAuthenticated} />} />

                {/* Protected routes wrapped inside Layout */}
                <Route element={<Layout />}>
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
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
