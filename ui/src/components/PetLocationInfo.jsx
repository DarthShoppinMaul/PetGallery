// PetLocationInfo.jsx
// Displays shelter or adoption center location details for a pet

import React from 'react';

export default function PetLocationInfo({ location }) {
    // Returns nothing if no location data provided
    if (!location) return null;

    // Renders location card with name, address, and optional phone
    return (
        <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Location</h2>
            <div className="bg-[#0A192F] rounded-xl p-4 border border-[#1b355e]">
                <div className="font-medium mb-1">{location.name}</div>
                <div className="text-[#B6C6DA] text-sm mb-1">
                    {location.address}
                </div>
                {location.phone && (
                    <div className="text-[#B6C6DA] text-sm">
                        Phone: {location.phone}
                    </div>
                )}
            </div>
        </div>
    );
}