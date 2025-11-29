// QuickActions.jsx
// Quick action buttons for admin dashboard

import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function QuickActions() {
    const navigate = useNavigate();

    const actions = [
        { label: 'Add Pet', path: '/add-pet', icon: '🐾' },
        { label: 'Add Location', path: '/add-location', icon: '📍' },
        { label: 'Manage Users', path: '/admin/users', icon: '👥' },
        { label: 'All Pets', path: '/pets', icon: '📋' }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {actions.map((action, index) => (
                <button
                    key={index}
                    onClick={() => navigate(action.path)}
                    className="panel py-6 hover:border-[#64FFDA] transition-colors text-center"
                >
                    <div className="text-2xl mb-2">{action.icon}</div>
                    <div className="font-medium">{action.label}</div>
                </button>
            ))}
        </div>
    );
}
