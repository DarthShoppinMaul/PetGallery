// ProtectedRoute.jsx
// Route wrapper that redirects unauthenticated users to login page

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    // Shows loading state while checking authentication
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    // Redirects to login if user is not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Renders protected content for authenticated users
    return children;
}