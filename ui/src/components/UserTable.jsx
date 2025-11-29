// UserTable.jsx
// Table display for users in admin view

import React from 'react';

export default function UserTable({
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
