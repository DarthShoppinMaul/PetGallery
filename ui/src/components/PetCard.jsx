// PetCard.jsx
// Displays a pet card with photo, info, and actions

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../services/api.js';
import StatusBadge from './StatusBadge.jsx';
import FavoriteButton from './FavoriteButton.jsx';

export default function PetCard({ 
    pet, 
    locationName, 
    showFavorite = false,
    isFavorite = false,
    onToggleFavorite,
    showStatus = true 
}) {
    const navigate = useNavigate();

    return (
        <div className="card relative" data-cy="pet-card">
            {showFavorite && (
                <FavoriteButton 
                    isFavorite={isFavorite}
                    onClick={() => onToggleFavorite(pet.pet_id)}
                />
            )}

            <div
                className="card-img"
                style={{
                    backgroundImage: pet.photo_url
                        ? `url(${API_BASE_URL}/${pet.photo_url})`
                        : undefined
                }}
            />

            <div className="card-body">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="font-semibold text-lg">{pet.name}</div>
                    {showStatus && <StatusBadge status={pet.status} />}
                </div>

                <div className="meta mb-2">
                    {pet.species} • {pet.age} {pet.age === 1 ? 'yr' : 'yrs'}
                </div>

                {locationName && (
                    <div className="pill mb-2" title={locationName}>
                        {locationName}
                    </div>
                )}

                <div className="desc mb-3">
                    {pet.description || 'No description available'}
                </div>

                <div className="card-actions">
                    <button
                        className="btn text-sm px-3 py-1.5"
                        onClick={() => navigate(`/pet/${pet.pet_id}`)}
                    >
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
}
