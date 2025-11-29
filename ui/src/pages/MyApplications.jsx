// MyApplications.jsx
// Page for users to view their submitted adoption applications

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
    const [filter, setFilter] = useState('all');

    const { applications, loading, error, refetch } = useApplications();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (user.is_admin) {
            navigate('/admin/dashboard');
        }
    }, [user, navigate]);

    const filteredApplications = filter === 'all'
        ? applications
        : applications.filter(app => app.status === filter);

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
