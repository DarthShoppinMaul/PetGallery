// ApplicationReview.jsx
// Components for admin application review page

import React from 'react';
import { API_BASE_URL } from '../services/api.js';
import StatusBadge from './StatusBadge.jsx';

// Displays application details for admin review
export function ApplicationReviewDetails({ application }) {
    // Format date to readable string
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Convert living situation code to display label
    const getLivingSituationLabel = (value) => {
        const labels = {
            'house_owned': 'House - Owned',
            'house_rented': 'House - Rented',
            'apartment_owned': 'Apartment/Condo - Owned',
            'apartment_rented': 'Apartment/Condo - Rented',
            'other': 'Other'
        };
        return labels[value] || value;
    };

    return (
        <div className="grid md:grid-cols-3 gap-6">
            {/* Pet info sidebar */}
            <div className="md:col-span-1">
                <div className="panel sticky top-4">
                    <div
                        className="w-full h-48 bg-[#152e56] rounded-xl bg-cover bg-center mb-4"
                        style={{
                            backgroundImage: application.pet_photo_url
                                ? `url(${API_BASE_URL}/${application.pet_photo_url})`
                                : undefined
                        }}
                    />
                    <h2 className="text-xl font-semibold mb-2">{application.pet_name}</h2>
                    <div className="text-[#B6C6DA] text-sm mb-2">
                        {application.pet_species} - {application.pet_age} years old
                    </div>
                    <StatusBadge status={application.status} />
                </div>
            </div>

            {/* Application details section */}
            <div className="md:col-span-2 space-y-4">
                {/* Applicant information panel */}
                <div className="panel">
                    <h3 className="text-lg font-semibold mb-4">Applicant Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-[#B6C6DA] text-sm">Name</div>
                            <div>{application.user_display_name || 'N/A'}</div>
                        </div>
                        <div>
                            <div className="text-[#B6C6DA] text-sm">Email</div>
                            <div>{application.user_email}</div>
                        </div>
                        <div>
                            <div className="text-[#B6C6DA] text-sm">Phone</div>
                            <div>{application.contact_phone || 'N/A'}</div>
                        </div>
                        <div>
                            <div className="text-[#B6C6DA] text-sm">Applied On</div>
                            <div>{formatDate(application.application_date)}</div>
                        </div>
                    </div>
                </div>

                {/* Application details panel */}
                <div className="panel">
                    <h3 className="text-lg font-semibold mb-4">Application Details</h3>

                    <div className="mb-4">
                        <div className="text-[#B6C6DA] text-sm mb-1">Living Situation</div>
                        <div>{getLivingSituationLabel(application.living_situation)}</div>
                    </div>

                    <div className="mb-4">
                        <div className="text-[#B6C6DA] text-sm mb-1">Has Other Pets</div>
                        <div>{application.has_other_pets ? 'Yes' : 'No'}</div>
                    </div>

                    {/* Other pets details if applicable */}
                    {application.has_other_pets && application.other_pets_details && (
                        <div className="mb-4">
                            <div className="text-[#B6C6DA] text-sm mb-1">Other Pets Details</div>
                            <div className="bg-[#0A192F] rounded-xl p-3 border border-[#1b355e]">
                                {application.other_pets_details}
                            </div>
                        </div>
                    )}

                    {/* Application message */}
                    <div>
                        <div className="text-[#B6C6DA] text-sm mb-1">Why They Want to Adopt</div>
                        <div className="bg-[#0A192F] rounded-xl p-3 border border-[#1b355e]">
                            {application.application_message}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Admin action buttons for reviewing applications
export function ApplicationReviewActions({
                                             adminNotes,
                                             onNotesChange,
                                             onApprove,
                                             onReject,
                                             isSubmitting,
                                             isPending
                                         }) {
    // Only show actions for pending applications
    if (!isPending) {
        return null;
    }

    return (
        <div className="panel mt-6">
            <h3 className="text-lg font-semibold mb-4">Review Decision</h3>

            {/* Admin notes textarea */}
            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">
                    Admin Notes (Required for rejection)
                </label>
                <textarea
                    className="textarea w-full"
                    value={adminNotes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    rows="3"
                    placeholder="Add notes about your decision..."
                    disabled={isSubmitting}
                    data-cy="admin-notes-input"
                />
            </div>

            {/* Approve and reject buttons */}
            <div className="flex gap-4">
                <button
                    onClick={onApprove}
                    className="btn flex-1"
                    disabled={isSubmitting}
                    data-cy="approve-button"
                >
                    {isSubmitting ? 'Processing...' : 'Approve Application'}
                </button>
                <button
                    onClick={onReject}
                    className="btn-danger flex-1"
                    disabled={isSubmitting}
                    data-cy="reject-button"
                >
                    {isSubmitting ? 'Processing...' : 'Reject Application'}
                </button>
            </div>
        </div>
    );
}