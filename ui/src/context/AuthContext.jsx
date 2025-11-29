// AuthContext.jsx
// Manages global authentication state with JWT support

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api.js';

const AuthContext = createContext(null);

// AuthProvider wraps the app and provides auth functionality
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    // Check if user is authenticated via JWT cookie
    const checkAuth = async () => {
        try {
            const userData = await authAPI.me();
            setUser(userData);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Log in a user with JWT token
    const login = async (email, password, rememberMe = false) => {
        try {
            const userData = await authAPI.login(email, password, rememberMe);
            setUser(userData);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Login failed'
            };
        }
    };

    // Register a new user
    const register = async (formData) => {
        try {
            const userData = await authAPI.register(
                formData.email,
                formData.password,
                formData.displayName
            );
            setUser(userData);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Registration failed'
            };
        }
    };

    // Log out current user
    const logout = async () => {
        try {
            await authAPI.logout();
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
            setUser(null);
        }
    };

    const value = {
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to access authentication state
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};