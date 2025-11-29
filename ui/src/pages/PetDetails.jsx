// PetDetails.jsx
// Pet details page with favorite and apply to adopt functionality

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { usePet, useLocations, useFavorites } from '../hooks/petHooks.js';
import { API_BASE_URL } from '../services/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import FavoriteButton from '../components/FavoriteButton.jsx';
import PetLocationInfo from '../components/PetLocationInfo.jsx';

export default function PetDetails() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const { pet, loading, error } = usePet(id);
    const { locations } = useLocations();
    const { isFavorite, toggleFavorite } = useFavorites(user?.user_id);

    const location = locations.find(l => l.location_id === pet?.location_id);

    const handleToggleFavorite = () => {
        if (!user) {
            alert('Please login to favorite pets');
            navigate('/login');
            return;
        }
        toggleFavorite(pet.pet_id);
    };

    const handleApplyToAdopt = () => {
        if (!user) {
            alert('Please login to apply for adoption');
            navigate('/login');
            return;
        }
        navigate(`/apply/${pet.pet_id}`);
    };

    if (loading) {
        return <LoadingSpinner message="Loading pet details..." />;
    }

    if (error || !pet) {
        return (
            <div className="container-narrow">
                <div className="text-center py-8 text-red-400">
                    {error || 'Pet not found'}
                </div>
            </div>
        );
    }

    return (
        <div className="container-narrow">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-[#64FFDA] hover:underline flex items-center gap-2"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to List
            </button>

            <div className="panel">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative">
                        <div
                            className="w-full h-96 bg-[#152e56] rounded-xl bg-cover bg-center"
                            style={{
                                backgroundImage: pet.photo_url
                                    ? `url(${API_BASE_URL}/${pet.photo_url})`
                                    : undefined
                            }}
                        />

                        {user && (
                            <button
                                onClick={handleToggleFavorite}
                                className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center bg-[#0A192F]/80 backdrop-blur-sm rounded-full border border-[#1b355e] hover:bg-[#112240] transition-colors"
                            >
                                {isFavorite(pet.pet_id) ? (
                                    <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6 text-[#64FFDA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                )}
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">{pet.name}</h1>
                                <div className="text-lg text-[#B6C6DA]">
                                    {pet.species} • {pet.age} {pet.age === 1 ? 'year' : 'years'} old
                                </div>
                            </div>
                            <StatusBadge status={pet.status} />
                        </div>

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-2">About {pet.name}</h2>
                            <p className="text-[#B6C6DA] leading-relaxed">
                                {pet.description || 'No description available.'}
                            </p>
                        </div>

                        {location && <PetLocationInfo location={location} />}

                        <div className="mt-auto space-y-3">
                            {user && pet.status === 'approved' && (
                                <button
                                    onClick={handleApplyToAdopt}
                                    className="btn w-full text-lg py-3"
                                    data-cy="apply-button"
                                >
                                    Apply to Adopt {pet.name}
                                </button>
                            )}

                            {!user && pet.status === 'approved' && (
                                <button
                                    onClick={() => navigate('/login')}
                                    className="btn w-full text-lg py-3"
                                >
                                    Login to Apply
                                </button>
                            )}

                            {pet.status === 'pending' && (
                                <div className="bg-yellow-900/30 border border-yellow-500 rounded-xl p-4 text-yellow-400 text-center">
                                    This pet is pending approval
                                </div>
                            )}

                            {pet.status === 'adopted' && (
                                <div className="bg-gray-600/30 border border-gray-500 rounded-xl p-4 text-gray-400 text-center">
                                    This pet has been adopted
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
