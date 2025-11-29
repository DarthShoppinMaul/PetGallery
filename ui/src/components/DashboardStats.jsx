// DashboardStats.jsx
// Statistics cards for admin dashboard

import React from 'react';

export default function DashboardStats({ stats }) {
    const statItems = [
        { label: 'Total Pets', value: stats.totalPets, color: 'text-[#64FFDA]' },
        { label: 'Locations', value: stats.totalLocations, color: 'text-[#64FFDA]' },
        { label: 'Total Users', value: stats.totalUsers, color: 'text-[#64FFDA]' },
        { label: 'Pending Apps', value: stats.pendingApplications, color: 'text-yellow-400' }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {statItems.map((item, index) => (
                <div key={index} className="panel text-center py-6">
                    <div className={`text-3xl font-bold ${item.color} mb-1`}>
                        {item.value}
                    </div>
                    <div className="text-[#B6C6DA] text-sm">{item.label}</div>
                </div>
            ))}
        </div>
    );
}
