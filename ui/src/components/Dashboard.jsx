// Dashboard.jsx
// Components for the Admin Dashboard page

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../services/api.js';

// Statistics cards displaying key admin metrics
export function DashboardStats({ stats }) {
    const statItems = [
        { label: 'Total Pets', value: stats.totalPets, color: 'text-[#64FFDA]' },
        { label: 'Locations', value: stats.totalLocations, color: 'text-[#64FFDA]' },
        { label: 'Total Users', value: stats.totalUsers, color: 'text-[#64FFDA]' },
        { label: 'Pending Apps', value: stats.pendingApplications, color: 'text-yellow-400' }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {statItems.map((item, index) => (
                <div key={index} className="panel text-center py-6">
                    <div className={`text-3xl font-bold ${item.color} mb-1`}>
                        {item.value}
                    </div>
                    <div className="text-[#B6C6DA] text-sm">{item.label}</div>
                </div>
            ))}
        </div>
    );
}

// Quick action navigation buttons for common admin tasks
export function QuickActions() {
    const navigate = useNavigate();

    const actions = [
        { label: 'Add Pet', path: '/add-pet', icon: 'P' },
        { label: 'Add Location', path: '/add-location', icon: 'L' },
        { label: 'Manage Users', path: '/admin/users', icon: 'U' },
        { label: 'All Pets', path: '/pets', icon: 'A' }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {actions.map((action, index) => (
                <button
                    key={index}
                    onClick={() => navigate(action.path)}
                    className="panel py-6 hover:border-[#64FFDA] transition-colors text-center"
                >
                    <div className="text-2xl mb-2 text-[#64FFDA]">{action.icon}</div>
                    <div className="font-medium">{action.label}</div>
                </button>
            ))}
        </div>
    );
}

// Table displaying pending adoption applications for admin review
export function PendingApplicationsTable({ applications }) {
    const navigate = useNavigate();

    // Format date to readable string
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Empty state when no pending applications
    if (applications.length === 0) {
        return (
            <p className="text-[#B6C6DA] text-center py-8">
                No pending applications! All caught up.
            </p>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                <tr className="border-b border-[#1b355e]">
                    <th className="text-left py-3 px-4 font-medium text-[#E6F1FF]">Pet</th>
                    <th className="text-left py-3 px-4 font-medium text-[#E6F1FF]">Applicant</th>
                    <th className="text-left py-3 px-4 font-medium text-[#E6F1FF]">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-[#E6F1FF]">Waiting</th>
                    <th className="text-right py-3 px-4 font-medium text-[#E6F1FF]">Action</th>
                </tr>
                </thead>
                <tbody>
                {applications.map(app => (
                    <tr key={app.application_id} className="border-b border-[#1b355e] last:border-b-0">
                        {/* Pet column with thumbnail */}
                        <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 bg-[#152e56] rounded-lg bg-cover bg-center"
                                    style={{
                                        backgroundImage: app.pet_photo_url
                                            ? `url(${API_BASE_URL}/${app.pet_photo_url})`
                                            : undefined
                                    }}
                                />
                                <span className="font-medium">{app.pet_name}</span>
                            </div>
                        </td>
                        <td className="py-3 px-4">{app.user_display_name || app.user_email}</td>
                        <td className="py-3 px-4">{formatDate(app.application_date)}</td>
                        {/* Highlight applications waiting over 3 days */}
                        <td className="py-3 px-4">
                                <span className={`${app.days_waiting > 3 ? 'text-yellow-400' : ''}`}>
                                    {app.days_waiting} days
                                </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                            <button
                                onClick={() => navigate(`/admin/application/${app.application_id}`)}
                                className="btn-sm"
                                data-cy={`review-app-${app.application_id}`}
                            >
                                Review
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}