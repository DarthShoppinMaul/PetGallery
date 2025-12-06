// PetGrid.jsx
// Renders a responsive grid of pet cards with favorite functionality

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
    // Looks up location name by ID from the locations array
    const getLocationName = (locationId) => {
        if (!locations) return 'Unknown';
        const location = locations.find(l => l.location_id === locationId);
        return location ? location.name : 'Unknown';
    };

    // Handle undefined or empty pets array
    if (!pets || pets.length === 0) {
        return (
            <div className="text-center py-8 text-[#B6C6DA]">
                {emptyMessage}
            </div>
        );
    }

    // Render grid of pet cards with location names and favorite status
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