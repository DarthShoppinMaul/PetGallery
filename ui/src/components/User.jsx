// User.jsx
// Consolidated components for User Management

import React from 'react';

// Form for creating new users (admin only)
export function CreateUserForm({
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

// Table display for users in admin view
export function UserTable({
    users,
    currentUserId,
    editingId,
    editedUser,
    onEditClick,
    onCancelEdit,
    onSaveEdit,
    onEditChange,
    onDeleteClick
}) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (users.length === 0) {
        return <p className="text-[#B6C6DA]">No users found.</p>;
    }

    return (
        <table className="w-full">
            <thead>
                <tr className="border-b border-[#1b355e]">
                    <th className="text-left py-3 px-4 font-medium text-[#E6F1FF]">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-[#E6F1FF]">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-[#E6F1FF]">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-[#E6F1FF]">Created</th>
                    <th className="text-right py-3 px-4 font-medium text-[#E6F1FF]">Actions</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                    <tr key={user.user_id} className="border-b border-[#1b355e] last:border-b-0">
                        <td className="py-3 px-4">
                            {editingId === user.user_id ? (
                                <input
                                    className="input input-sm w-full"
                                    value={editedUser.display_name}
                                    onChange={(e) => onEditChange('display_name', e.target.value)}
                                    data-cy="edit-display-name"
                                />
                            ) : (
                                <span className="font-medium">{user.display_name}</span>
                            )}
                        </td>
                        <td className="py-3 px-4">
                            {editingId === user.user_id ? (
                                <input
                                    className="input input-sm w-full"
                                    type="email"
                                    value={editedUser.email}
                                    onChange={(e) => onEditChange('email', e.target.value)}
                                    data-cy="edit-email"
                                />
                            ) : (
                                user.email
                            )}
                        </td>
                        <td className="py-3 px-4">
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                user.is_admin
                                    ? 'bg-purple-900/30 text-purple-400 border border-purple-500'
                                    : 'bg-blue-900/30 text-blue-400 border border-blue-500'
                            }`}>
                                {user.is_admin ? 'Admin' : 'User'}
                            </span>
                        </td>
                        <td className="py-3 px-4 text-[#B6C6DA] text-sm">
                            {formatDate(user.created_at)}
                        </td>
                        <td className="py-3 px-4 text-right">
                            {editingId === user.user_id ? (
                                <>
                                    <button
                                        className="btn-sm bg-[#64FFDA] text-[#081424] mr-2"
                                        onClick={() => onSaveEdit(user.user_id)}
                                        data-cy="save-user-button"
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="btn-sm btn-secondary"
                                        onClick={onCancelEdit}
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        className="btn-sm bg-[#64FFDA] text-[#081424] mr-2"
                                        onClick={() => onEditClick(user)}
                                        data-cy={`edit-user-${user.user_id}`}
                                    >
                                        Edit
                                    </button>
                                    {user.user_id !== currentUserId && (
                                        <button
                                            className="btn-sm btn-danger"
                                            onClick={() => onDeleteClick(user.user_id)}
                                            data-cy={`delete-user-${user.user_id}`}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
