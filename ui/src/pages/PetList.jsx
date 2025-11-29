// PetList.jsx
// Pet browsing page with filters and favorites

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { usePets, useLocations, useFavorites } from '../hooks/petHooks.js';
import PetFilters from '../components/PetFilters.jsx';
import PetGrid from '../components/PetGrid.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export default function PetList() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const { pets, loading: petsLoading, error: petsError, refetch } = usePets();
    const { locations, loading: locationsLoading } = useLocations();
    const { favorites, toggleFavorite, isFavorite } = useFavorites(user?.user_id);

    const [filters, setFilters] = useState({
        species: '',
        location: '',
        status: '',
        search: ''
    });

    const handleToggleFavorite = (petId) => {
        if (!user) {
            alert('Please login to favorite pets');
            navigate('/login');
            return;
        }
        toggleFavorite(petId);
    };

    const filteredPets = pets.filter(pet => {
        if (filters.species && pet.species.toLowerCase() !== filters.species.toLowerCase()) return false;
        if (filters.location && pet.location_id.toString() !== filters.location) return false;
        if (filters.status && pet.status !== filters.status) return false;
        if (filters.search && !pet.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
        return true;
    });

    const uniqueSpecies = [...new Set(pets.map(p => p.species))].sort();

    if (petsLoading || locationsLoading) {
        return <LoadingSpinner message="Loading pets..." />;
    }

    if (petsError) {
        return <ErrorMessage message={petsError} onRetry={refetch} />;
    }

    return (
        <div className="container-narrow">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl">Adoptable Pets</h1>
                {user?.is_admin && (
                    <button onClick={() => navigate('/admin/manage-pets')} className="btn">
                        Manage Pets
                    </button>
                )}
            </div>

            <PetFilters
                filters={filters}
                onFilterChange={setFilters}
                species={uniqueSpecies}
                locations={locations}
            />

            <PetGrid
                pets={filteredPets}
                locations={locations}
                showFavorite={!!user}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                emptyMessage={
                    pets.length === 0
                        ? 'No pets available yet. Check back soon!'
                        : 'No pets found matching your filters.'
                }
            />
        </div>
    );
}
