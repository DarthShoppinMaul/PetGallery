// FilterTabs.jsx
// Tab buttons for filtering by status

import React from 'react';

export default function FilterTabs({ filter, onFilterChange, counts }) {
    // Tab configuration
    const tabs = [
        { key: 'all', label: 'All' },
        { key: 'pending', label: 'Pending' },
        { key: 'approved', label: 'Approved' },
        { key: 'rejected', label: 'Not Approved' }
    ];

    return (
        <div className="flex gap-2 mb-6 overflow-x-auto">
            {tabs.map(tab => (
                <button
                    key={tab.key}
                    onClick={() => onFilterChange(tab.key)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                        filter === tab.key
                            ? 'bg-[#64FFDA] text-[#081424] font-semibold'
                            : 'bg-[#233554] text-[#E6F1FF] hover:bg-[#2d4467]'
                    }`}
                >
                    {tab.label} ({counts[tab.key] || 0})
                </button>
            ))}
        </div>
    );
}