// CreateUserForm.jsx
// Form for creating new users (admin only)

import React from 'react';

export default function CreateUserForm({
    formData,
    onChange,
    onSubmit,
    onCancel,
    isSubmitting
}) {
    return (
        <div className="panel mb-6">
            <h2 className="text-xl font-bold mb-4">Create New User</h2>
            <form onSubmit={onSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium">Display Name *</label>
                        <input
                            className="input w-full"
                            value={formData.display_name}
                            onChange={(e) => onChange('display_name', e.target.value)}
                            placeholder="John Doe"
                            required
                            data-cy="new-user-display-name"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium">Email *</label>
                        <input
                            type="email"
                            className="input w-full"
                            value={formData.email}
                            onChange={(e) => onChange('email', e.target.value)}
                            placeholder="user@example.com"
                            required
                            data-cy="new-user-email"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium">Password *</label>
                        <input
                            type="password"
                            className="input w-full"
                            value={formData.password}
                            onChange={(e) => onChange('password', e.target.value)}
                            placeholder="******"
                            required
                            data-cy="new-user-password"
                        />
                    </div>
                    <div className="flex items-center">
                        <label className="flex items-center cursor-pointer mt-6">
                            <input
                                type="checkbox"
                                checked={formData.is_admin}
                                onChange={(e) => onChange('is_admin', e.target.checked)}
                                className="w-4 h-4 rounded border-[#3a5a86] bg-[#143058] text-[#64FFDA]"
                                data-cy="new-user-admin-checkbox"
                            />
                            <span className="ml-2">Admin privileges</span>
                        </label>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="btn"
                        disabled={isSubmitting}
                        data-cy="create-user-button"
                    >
                        {isSubmitting ? 'Creating...' : 'Create User'}
                    </button>
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
