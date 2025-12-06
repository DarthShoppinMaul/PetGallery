// AdminDashboard.jsx
// Admin dashboard with stats and pending applications

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { usePets, useLocations } from '../hooks/petHooks.js';
import { useUsers } from '../hooks/userHooks.js';
import { useApplications, useApplicationStats } from '../hooks/applicationHooks.js';
import { DashboardStats, QuickActions, PendingApplicationsTable } from '../components/Dashboard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

export default function AdminDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const { pets, loading: petsLoading } = usePets();
    const { locations, loading: locationsLoading } = useLocations();
    const { users, loading: usersLoading } = useUsers();
    const { applications, loading: appsLoading } = useApplications('pending');
    const { stats: appStats, loading: statsLoading } = useApplicationStats();

    useEffect(() => {
        if (!user?.is_admin) {
            navigate('/');
        }
    }, [user, navigate]);

    const loading = petsLoading || locationsLoading || usersLoading || appsLoading || statsLoading;

    if (loading) {
        return <LoadingSpinner message="Loading dashboard..." />;
    }

    const processedApplications = applications.map(app => {
        const applicationDate = new Date(app.application_date);
        const today = new Date();
        const diffTime = Math.abs(today - applicationDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return { ...app, days_waiting: diffDays };
    }).sort((a, b) => b.days_waiting - a.days_waiting).slice(0, 5);

    const stats = {
        totalPets: pets.length,
        totalLocations: locations.length,
        totalUsers: users.length,
        pendingApplications: appStats?.pending || 0
    };

    return (
        <div className="container-narrow">
            <h1 className="text-3xl mb-6">Admin Dashboard</h1>

            <DashboardStats stats={stats} />

            <QuickActions />

            <div className="panel">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Pending Applications</h2>
                    {processedApplications.length > 0 && (
                        <span className="text-[#B6C6DA] text-sm">
                            Showing top 5 by wait time
                        </span>
                    )}
                </div>

                <PendingApplicationsTable applications={processedApplications} />
            </div>
        </div>
    );
}