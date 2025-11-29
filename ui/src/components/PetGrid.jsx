// PetGrid.jsx
// Grid display for pet cards

import React from 'react';
import PetCard from './PetCard.jsx';

export default function PetGrid({ 
    pets, 
    locations, 
    showFavorite = false,
    favorites = new Set(),
    onToggleFavorite,
    emptyMessage = 'No pets found.'
}) {
    const getLocationName = (locationId) => {
        const location = locations.find(l => l.location_id === locationId);
        return location ? location.name : 'Unknown';
    };

    if (pets.length === 0) {
        return (
            <div className="text-center py-8 text-[#B6C6DA]">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className="grid-pets">
            {pets.map(pet => (
                <PetCard
                    key={pet.pet_id}
                    pet={pet}
                    locationName={getLocationName(pet.location_id)}
                    showFavorite={showFavorite}
                    isFavorite={favorites.has(pet.pet_id)}
                    onToggleFavorite={onToggleFavorite}
                />
            ))}
        </div>
    );
}
