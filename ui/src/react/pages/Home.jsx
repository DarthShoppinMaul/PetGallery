// Home.jsx
// Universal landing page that redirects to the pets list
// This provides a consistent entry point for all users

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    // Redirect to /pets on mount
    // This makes /pets the universal landing page for browsing adoptable pets
    useEffect(() => {
        navigate('/pets', { replace: true });
    }, [navigate]);

    // Show loading state while redirecting
    return (
        <div className="text-center py-8">
            <div className="text-lg">Loading...</div>
        </div>
    );
}