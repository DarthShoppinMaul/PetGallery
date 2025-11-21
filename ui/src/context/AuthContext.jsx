// AuthContext.jsx
// This file manages global authentication state with JWT support
// Provides login, logout, registration, and current user information to all components

import React, {createContext, useContext, useState, useEffect} from 'react';
import {authAPI} from '../services/api.js';

// Create a Context to share auth state across the app
const AuthContext = createContext(null);

// AuthProvider wraps the entire app and provides auth functionality
export function AuthProvider({children}) {
    // State: user object (contains email, name, etc.) or null if not logged in
    const [user, setUser] = useState(null);

    // State: loading flag - true while checking if user is authenticated
    const [loading, setLoading] = useState(true);

    // On component mount (app startup), check if user is already logged in
    useEffect(() => {
        checkAuth();
    }, []);

    // Function: Check if user is authenticated (has valid JWT in cookie)
    const checkAuth = async () => {
        try {
            // Call backend API to get current user info
            const userData = await authAPI.me();
            // If successful, set the user data
            setUser(userData);
        } catch (error) {
            // If error (not logged in), set user to null
            setUser(null);
        } finally {
            // Always set loading to false when done checking
            setLoading(false);
        }
    };

    // Function: Log in a user with JWT token
    // Parameters: email (string), password (string), rememberMe (boolean)
    // Returns: {success: boolean, error?: string}
    const login = async (email, password, rememberMe = false) => {
        try {
            // Call backend login endpoint with rememberMe flag
            const userData = await authAPI.login(email, password, rememberMe);
            // If successful, save user data
            setUser(userData);
            // Return success
            return {success: true};
        } catch (error) {
            // If error, return failure with error message
            return {
                success: false,
                error: error.response?.data?.detail || 'Login failed'
            };
        }
    };

    // Function: Register a new user
    // Parameters: formData (object with email, password, displayName, etc.)
    // Returns: {success: boolean, error?: string}
    const register = async (formData) => {
        try {
            // Call backend registration endpoint
            const userData = await authAPI.register(
                formData.email,
                formData.password,
                formData.displayName
            );
            // If successful, save user data (user is now logged in)
            setUser(userData);
            // Return success
            return {success: true};
        } catch (error) {
            // If error, return failure with error message
            return {
                success: false,
                error: error.response?.data?.detail || 'Registration failed'
            };
        }
    };

    // Function: Log out the current user (clears JWT cookie)
    const logout = async () => {
        try {
            // Call backend logout endpoint (clears JWT cookie)
            await authAPI.logout();
            // Clear user data from state
            setUser(null);
        } catch (error) {
            // Log error but still clear user (logout client-side)
            console.error('Logout error:', error);
            // Still clear user data even if API call fails
            setUser(null);
        }
    };

    // Create the value object that will be provided to all child components
    const value = {
        user,                          // User object or null
        isAuthenticated: !!user,       // Boolean: true if user exists
        loading,                       // Boolean: true while checking auth
        login,                         // Function to log in with remember me
        register,                      // Function to register new user
        logout,                        // Function to log out
    };

    // While checking authentication status, show loading screen
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    // Provide the auth value to all child components
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook: useAuth()
// Use this in any component to access authentication state/functions
export const useAuth = () => {
    const context = useContext(AuthContext);

    // Error if useAuth is called outside of AuthProvider
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};