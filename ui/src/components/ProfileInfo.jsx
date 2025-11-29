// ProfileInfo.jsx
// Displays user profile information

import React from 'react';

export default function ProfileInfo({ user, onEdit }) {
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
