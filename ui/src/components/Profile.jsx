// Profile.jsx
// Consolidated components for User Profile page

import React from 'react';

// Displays user profile information
export function ProfileInfo({ user, onEdit }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="panel">
            <div className="flex items-start justify-between mb-6">
                <h2 className="text-xl font-bold">Profile Information</h2>
                <button
                    onClick={onEdit}
                    className="btn-sm bg-[#64FFDA] text-[#081424]"
                    data-cy="edit-profile-button"
                >
                    Edit Profile
                </button>
            </div>

            <div className="space-y-4">
                <div>
                    <div className="text-[#B6C6DA] text-sm mb-1">Display Name</div>
                    <div className="text-lg">{user.display_name}</div>
                </div>

                <div>
                    <div className="text-[#B6C6DA] text-sm mb-1">Email</div>
                    <div className="text-lg">{user.email}</div>
                </div>

                <div>
                    <div className="text-[#B6C6DA] text-sm mb-1">Account Type</div>
                    <span className={`inline-block px-3 py-1 text-sm rounded-full ${
                        user.is_admin
                            ? 'bg-purple-900/30 text-purple-400 border border-purple-500'
                            : 'bg-blue-900/30 text-blue-400 border border-blue-500'
                    }`}>
                        {user.is_admin ? 'Administrator' : 'User'}
                    </span>
                </div>

                <div>
                    <div className="text-[#B6C6DA] text-sm mb-1">Member Since</div>
                    <div>{formatDate(user.created_at)}</div>
                </div>
            </div>
        </div>
    );
}

// Form for editing user profile
export function ProfileEditForm({
    formData,
    formErrors,
    onChange,
    onSubmit,
    onCancel,
    isSubmitting
}) {
    return (
        <div className="panel">
            <h2 className="text-xl font-bold mb-6">Edit Profile</h2>

            <form onSubmit={onSubmit}>
                <div className="space-y-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium">Display Name *</label>
                        <input
                            type="text"
                            name="display_name"
                            className={`input w-full ${formErrors.display_name ? 'border-red-500' : ''}`}
                            value={formData.display_name}
                            onChange={onChange}
                            disabled={isSubmitting}
                            data-cy="profile-display-name"
                        />
                        {formErrors.display_name && (
                            <div className="text-red-400 text-sm mt-1">{formErrors.display_name}</div>
                        )}
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium">Email *</label>
                        <input
                            type="email"
                            name="email"
                            className={`input w-full ${formErrors.email ? 'border-red-500' : ''}`}
                            value={formData.email}
                            onChange={onChange}
                            disabled={isSubmitting}
                            data-cy="profile-email"
                        />
                        {formErrors.email && (
                            <div className="text-red-400 text-sm mt-1">{formErrors.email}</div>
                        )}
                    </div>

                    <div className="border-t border-[#1b355e] pt-4 mt-4">
                        <h3 className="font-medium mb-3">Change Password (Optional)</h3>

                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium">New Password</label>
                            <input
                                type="password"
                                name="password"
                                className={`input w-full ${formErrors.password ? 'border-red-500' : ''}`}
                                value={formData.password}
                                onChange={onChange}
                                placeholder="Leave blank to keep current password"
                                disabled={isSubmitting}
                                data-cy="profile-password"
                            />
                            {formErrors.password && (
                                <div className="text-red-400 text-sm mt-1">{formErrors.password}</div>
                            )}
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium">Confirm New Password</label>
                            <input
                                type="password"
                                name="confirm_password"
                                className={`input w-full ${formErrors.confirm_password ? 'border-red-500' : ''}`}
                                value={formData.confirm_password}
                                onChange={onChange}
                                placeholder="Confirm new password"
                                disabled={isSubmitting}
                                data-cy="profile-confirm-password"
                            />
                            {formErrors.confirm_password && (
                                <div className="text-red-400 text-sm mt-1">{formErrors.confirm_password}</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 mt-6">
                    <button
                        type="submit"
                        className="btn"
                        disabled={isSubmitting}
                        data-cy="save-profile-button"
                    >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

// Section for deleting user account
export function DeleteAccountSection({
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
