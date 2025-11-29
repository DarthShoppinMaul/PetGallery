// ProfileEditForm.jsx
// Form for editing user profile

import React from 'react';

export default function ProfileEditForm({
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
