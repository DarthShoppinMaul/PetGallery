// MyApplications.jsx
// Displays the current user's submitted adoption applications
// Provides filtering by status and redirects admins to dashboard

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useApplications } from '../hooks/applicationHooks.js';
import ApplicationsList from '../components/ApplicationsList.jsx';
import FilterTabs from '../components/FilterTabs.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export default function MyApplications() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Current filter selection
    const [filter, setFilter] = useState('all');

    // Fetch user's applications
    const { applications, loading, error, refetch } = useApplications();

    // Redirect unauthenticated users to login, admins to dashboard
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (user.is_admin) {
            navigate('/admin/dashboard');
        }
    }, [user, navigate]);

    // Apply status filter to applications list
    const filteredApplications = filter === 'all'
        ? applications
        : applications.filter(app => app.status === filter);

    // Calculate counts for each status tab
    const statusCounts = {
        all: applications.length,
        pending: applications.filter(a => a.status === 'pending').length,
        approved: applications.filter(a => a.status === 'approved').length,
        rejected: applications.filter(a => a.status === 'rejected').length
    };

    if (loading) {
        return <LoadingSpinner message="Loading applications..." />;
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={refetch} />;
    }

    return (
        <div className="container-narrow">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl">My Applications</h1>
                <button onClick={() => navigate('/pets')} className="btn">
                    Browse Pets
                </button>
            </div>

            <FilterTabs
                filter={filter}
                onFilterChange={setFilter}
                counts={statusCounts}
            />

            <ApplicationsList
                applications={filteredApplications}
                emptyMessage={
                    filter === 'all'
                        ? "You haven't submitted any applications yet."
                        : `No ${filter} applications.`
                }
            />
        </div>
    );
}