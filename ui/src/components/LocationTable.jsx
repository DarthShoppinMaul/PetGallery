// LocationTable.jsx
// Table display for locations in admin view

import React from 'react';

export default function LocationTable({ locations, onEdit, onDelete }) {
    if (locations.length === 0) {
        return (
            <p className="text-[#B6C6DA]">No locations found. Add your first location!</p>
        );
    }

    return (
        <table className="w-full">
            <thead>
                <tr className="border-b border-[#1b355e]">
                    <th className="text-left py-3 px-4 font-medium text-[#E6F1FF]">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-[#E6F1FF]">Address</th>
                    <th className="text-left py-3 px-4 font-medium text-[#E6F1FF]">Phone</th>
                    <th className="text-right py-3 px-4 font-medium text-[#E6F1FF]">Actions</th>
                </tr>
            </thead>
            <tbody>
                {locations.map(location => (
                    <tr key={location.location_id} className="border-b border-[#1b355e] last:border-b-0">
                        <td className="py-3 px-4 font-medium">{location.name}</td>
                        <td className="py-3 px-4">{location.address}</td>
                        <td className="py-3 px-4">{location.phone || 'N/A'}</td>
                        <td className="py-3 px-4 text-right">
                            <button
                                className="btn-sm bg-[#64FFDA] text-[#081424] mr-2"
                                onClick={() => onEdit(location)}
                                data-cy={`edit-location-${location.location_id}`}
                            >
                                Edit
                            </button>
                            <button
                                className="btn-sm btn-danger"
                                onClick={() => onDelete(location.location_id)}
                                data-cy={`delete-location-${location.location_id}`}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
