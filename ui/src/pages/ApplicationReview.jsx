// ApplicationReview.jsx
// Admin page to review and approve/reject adoption applications

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useApplication, useUpdateApplication } from '../hooks/applicationHooks.js';
import { ApplicationReviewDetails, ApplicationReviewActions } from '../components/ApplicationReview.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export default function ApplicationReview() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Fetch application data and update function
    const { application, loading, error, refetch } = useApplication(id);
    const { updateApplication } = useUpdateApplication();

    // Form state for admin notes and submission status
    const [adminNotes, setAdminNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionError, setActionError] = useState(null);

    // Redirect non-admin users to home page
    useEffect(() => {
        if (!user?.is_admin) {
            navigate('/');
        }
    }, [user, navigate]);

    // Populate admin notes when application loads
    useEffect(() => {
        if (application) {
            setAdminNotes(application.admin_notes || '');
        }
    }, [application]);

    // Handle application approval with confirmation
    const handleApprove = async () => {
        if (!confirm(`Approve application for ${application.pet_name}?`)) return;

        setIsSubmitting(true);
        setActionError(null);

        const result = await updateApplication(parseInt(id), {
            status: 'approved',
            admin_notes: adminNotes
        });

        if (result.success) {
            alert('Application approved successfully!');
            navigate('/admin/dashboard');
        } else {
            setActionError(result.error);
        }

        setIsSubmitting(false);
    };

    // Handle application rejection with required notes
    const handleReject = async () => {
        if (!adminNotes.trim()) {
            alert('Please add admin notes explaining the rejection reason.');
            return;
        }

        if (!confirm(`Reject application for ${application.pet_name}?`)) return;

        setIsSubmitting(true);
        setActionError(null);

        const result = await updateApplication(parseInt(id), {
            status: 'rejected',
            admin_notes: adminNotes
        });

        if (result.success) {
            alert('Application rejected.');
            navigate('/admin/dashboard');
        } else {
            setActionError(result.error);
        }

        setIsSubmitting(false);
    };

    // Show loading state while fetching application
    if (loading) {
        return <LoadingSpinner message="Loading application..." />;
    }

    // Show error state if application not found
    if (error || !application) {
        return <ErrorMessage message={error || 'Application not found'} onRetry={refetch} />;
    }

    return (
        <div className="container-narrow">
            {/* Back navigation button */}
            <button
                onClick={() => navigate('/admin/dashboard')}
                className="mb-4 text-[#64FFDA] hover:underline flex items-center gap-2"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
            </button>

            <h1 className="text-3xl mb-6">Review Application</h1>

            {/* Error message display */}
            {actionError && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-500 text-red-400 rounded-xl">
                    {actionError}
                </div>
            )}

            {/* Application details component */}
            <ApplicationReviewDetails application={application} />

            {/* Admin action buttons for approve/reject */}
            <ApplicationReviewActions
                adminNotes={adminNotes}
                onNotesChange={setAdminNotes}
                onApprove={handleApprove}
                onReject={handleReject}
                isSubmitting={isSubmitting}
                isPending={application.status === 'pending'}
            />
        </div>
    );
}