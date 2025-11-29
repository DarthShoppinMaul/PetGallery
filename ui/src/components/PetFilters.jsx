// PetFilters.jsx
// Filter controls for pet list pages

import React from 'react';

export default function PetFilters({ 
    filters, 
    onFilterChange, 
    species = [], 
    locations = [] 
}) {
    const handleChange = (field, value) => {
        onFilterChange({ ...filters, [field]: value });
    };

    return (
        <div className="panel mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                    type="text"
                    placeholder="Search by name..."
                    className="input"
                    value={filters.search}
                    onChange={(e) => handleChange('search', e.target.value)}
                    data-cy="search-input"
                />

                <select
                    className="input"
                    value={filters.species}
                    onChange={(e) => handleChange('species', e.target.value)}
                    data-cy="species-filter"
                >
                    <option value="">All Species</option>
                    {species.map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>

                <select
                    className="input"
                    value={filters.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    data-cy="location-filter"
                >
                    <option value="">All Locations</option>
                    {locations.map(loc => (
                        <option key={loc.location_id} value={loc.location_id}>
                            {loc.name}
                        </option>
                    ))}
                </select>

                <select
                    className="input"
                    value={filters.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    data-cy="status-filter"
                >
                    <option value="">All Statuses</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                </select>
            </div>
        </div>
    );
}
