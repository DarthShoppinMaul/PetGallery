// DeleteAccountSection.jsx
// Section for deleting user account

import React from 'react';

export default function DeleteAccountSection({
    showConfirm,
    onShowConfirm,
    onConfirmDelete,
    onCancelDelete,
    isSubmitting
}) {
    return (
        <div className="panel mt-6 border-red-500/30">
            <h2 className="text-xl font-bold mb-4 text-red-400">Danger Zone</h2>

            {!showConfirm ? (
                <div>
                    <p className="text-[#B6C6DA] mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button
                        onClick={onShowConfirm}
                        className="btn-danger"
                        data-cy="delete-account-button"
                    >
                        Delete My Account
                    </button>
                </div>
            ) : (
                <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-4">
                    <p className="text-red-400 mb-4 font-medium">
                        Are you absolutely sure you want to delete your account?
                    </p>
                    <p className="text-[#B6C6DA] mb-4 text-sm">
                        This will permanently delete your account, all your applications, and favorites.
                        This action cannot be undone.
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={onConfirmDelete}
                            className="btn-danger"
                            disabled={isSubmitting}
                            data-cy="confirm-delete-button"
                        >
                            {isSubmitting ? 'Deleting...' : 'Yes, Delete My Account'}
                        </button>
                        <button
                            onClick={onCancelDelete}
                            className="btn-secondary"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
