// ApplicationsList.jsx
// Displays a list of user's adoption applications

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../services/api.js';
import StatusBadge from './StatusBadge.jsx';

export default function ApplicationsList({ applications, emptyMessage }) {
    const navigate = useNavigate();

    // Format date to readable string
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Empty state display
    if (applications.length === 0) {
        return (
            <div className="panel text-center py-12">
                <svg className="w-16 h-16 mx-auto mb-4 text-[#B6C6DA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-[#B6C6DA] mb-4">{emptyMessage}</p>
                <button onClick={() => navigate('/pets')} className="btn">
                    Browse Available Pets
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {applications.map(app => (
                <div key={app.application_id} className="panel">
                    <div className="flex gap-4">
                        {/* Pet photo thumbnail */}
                        <div
                            className="w-32 h-32 bg-[#152e56] rounded-xl bg-cover bg-center flex-shrink-0"
                            style={{
                                backgroundImage: app.pet_photo_url
                                    ? `url(${API_BASE_URL}/${app.pet_photo_url})`
                                    : undefined
                            }}
                        />

                        {/* Application details */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <div>
                                    <h3 className="text-xl font-semibold mb-1">{app.pet_name}</h3>
                                    <div className="text-[#B6C6DA] text-sm">
                                        {app.pet_species} - {app.pet_age} years old
                                    </div>
                                </div>
                                <StatusBadge status={app.status} />
                            </div>

                            {/* Application dates */}
                            <div className="text-sm text-[#B6C6DA] mb-3">
                                Applied on {formatDate(app.application_date)}
                                {app.reviewed_at && (
                                    <span> - Reviewed on {formatDate(app.reviewed_at)}</span>
                                )}
                            </div>

                            {/* Admin notes display */}
                            {app.admin_notes && (
                                <div className={`rounded-xl p-3 mb-3 border ${
                                    app.status === 'approved'
                                        ? 'bg-green-900/20 border-green-500/30 text-green-300'
                                        : 'bg-red-900/20 border-red-500/30 text-red-300'
                                }`}>
                                    <div className="font-medium text-sm mb-1">
                                        {app.status === 'approved' ? 'Good news!' : 'Feedback from our team:'}
                                    </div>
                                    <div className="text-sm">{app.admin_notes}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}