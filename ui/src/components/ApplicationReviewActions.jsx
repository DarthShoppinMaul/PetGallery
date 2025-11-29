// ApplicationReviewActions.jsx
// Admin actions for reviewing applications

import React from 'react';

export default function ApplicationReviewActions({
    adminNotes,
    onNotesChange,
    onApprove,
    onReject,
    isSubmitting,
    isPending
}) {
    if (!isPending) {
        return null;
    }

    return (
        <div className="panel mt-6">
            <h3 className="text-lg font-semibold mb-4">Review Decision</h3>

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
