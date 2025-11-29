// PendingApplicationsTable.jsx
// Table of pending applications for admin dashboard

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../services/api.js';

export default function PendingApplicationsTable({ applications }) {
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

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
