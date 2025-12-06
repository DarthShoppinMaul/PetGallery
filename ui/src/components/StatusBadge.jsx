// StatusBadge.jsx
// Displays a colored status badge for pet or application status

import React from 'react';

// Style mappings for each status type
const statusStyles = {
    approved: 'bg-green-900/30 text-green-400 border-green-500',
    pending: 'bg-yellow-900/30 text-yellow-400 border-yellow-500',
    adopted: 'bg-gray-600/30 text-gray-400 border-gray-500',
    rejected: 'bg-red-900/30 text-red-400 border-red-500',
};

export default function StatusBadge({ status }) {
    // Handle undefined or empty status
    if (!status) {
        return null;
    }

    // Capitalize first letter of status for display
    const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);
    // Fall back to pending style if status not found
    const style = statusStyles[status] || statusStyles.pending;

    return (
        <span className={`inline-block px-3 py-1 text-xs rounded-full border ${style}`}>
            {displayStatus}
        </span>
    );
}