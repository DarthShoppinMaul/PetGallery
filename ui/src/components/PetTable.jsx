// PetTable.jsx
// Table display for pets in admin view

import React from 'react';
import StatusBadge from './StatusBadge.jsx';

export default function PetTable({ pets, locations, onEdit, onDelete }) {
    const getLocationName = (locationId) => {
        const loc = locations.find(l => l.location_id === locationId);
        return loc ? loc.name : 'Unknown';
    };

    if (pets.length === 0) {
        return (
            <p className="text-[#B6C6DA]">No pets found. Add your first pet!</p>
        );
    }

    return (
        <table className="w-full">
            <thead>
                <tr className="border-b border-[#1b355e]">
                    <th className="text-left py-3 px-4 font-medium text-[#E6F1FF]">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-[#E6F1FF]">Species</th>
                    <th className="text-left py-3 px-4 font-medium text-[#E6F1FF]">Age</th>
                    <th className="text-left py-3 px-4 font-medium text-[#E6F1FF]">Location</th>
                    <th className="text-left py-3 px-4 font-medium text-[#E6F1FF]">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-[#E6F1FF]">Actions</th>
                </tr>
            </thead>
            <tbody>
                {pets.map(pet => (
                    <tr key={pet.pet_id} className="border-b border-[#1b355e] last:border-b-0">
                        <td className="py-3 px-4 font-medium">{pet.name}</td>
                        <td className="py-3 px-4">{pet.species}</td>
                        <td className="py-3 px-4">{pet.age} {pet.age === 1 ? 'yr' : 'yrs'}</td>
                        <td className="py-3 px-4">{getLocationName(pet.location_id)}</td>
                        <td className="py-3 px-4">
                            <StatusBadge status={pet.status} />
                        </td>
                        <td className="py-3 px-4 text-right">
                            <button
                                className="btn-sm bg-[#64FFDA] text-[#081424] mr-2"
                                onClick={() => onEdit(pet)}
                                data-cy={`edit-pet-${pet.pet_id}`}
                            >
                                Edit
                            </button>
                            <button
                                className="btn-sm btn-danger"
                                onClick={() => onDelete(pet.pet_id)}
                                data-cy={`delete-pet-${pet.pet_id}`}
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
