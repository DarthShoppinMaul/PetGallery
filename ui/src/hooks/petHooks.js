// petHooks.js
// Custom hooks for pet-related API operations

import { useState, useEffect, useCallback } from 'react';
import { petsAPI, locationsAPI, favoritesAPI } from '../services/api.js';

// Hook to fetch all pets with optional filtering
export function usePets() {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPets = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await petsAPI.list();
            setPets(data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to load pets');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPets();
    }, [fetchPets]);

    return { pets, loading, error, refetch: fetchPets };
}

// Hook to fetch a single pet by ID
export function usePet(petId) {
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPet = useCallback(async () => {
        if (!petId) return;
        setLoading(true);
        setError(null);
        try {
            const data = await petsAPI.get(petId);
            setPet(data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to load pet');
        } finally {
            setLoading(false);
        }
    }, [petId]);

    useEffect(() => {
        fetchPet();
    }, [fetchPet]);

    return { pet, loading, error, refetch: fetchPet };
}

// Hook to create a new pet
export function useCreatePet() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createPet = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const result = await petsAPI.create(formData);
            return { success: true, data: result };
        } catch (err) {
            const errorMsg = err.response?.data?.detail || 'Failed to create pet';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    };

    return { createPet, loading, error };
}

// Hook to update an existing pet
export function useUpdatePet() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updatePet = async (petId, formData) => {
        setLoading(true);
        setError(null);
        try {
            const result = await petsAPI.update(petId, formData);
            return { success: true, data: result };
        } catch (err) {
            const errorMsg = err.response?.data?.detail || 'Failed to update pet';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    };

    return { updatePet, loading, error };
}

// Hook to delete a pet
export function useDeletePet() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deletePet = async (petId) => {
        setLoading(true);
        setError(null);
        try {
            await petsAPI.delete(petId);
            return { success: true };
        } catch (err) {
            const errorMsg = err.response?.data?.detail || 'Failed to delete pet';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    };

    return { deletePet, loading, error };
}

// Hook to approve a pet
export function useApprovePet() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const approvePet = async (petId) => {
        setLoading(true);
        setError(null);
        try {
            const result = await petsAPI.approve(petId);
            return { success: true, data: result };
        } catch (err) {
            const errorMsg = err.response?.data?.detail || 'Failed to approve pet';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    };

    return { approvePet, loading, error };
}

// Hook to fetch all locations
export function useLocations() {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLocations = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await locationsAPI.list();
            setLocations(data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to load locations');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLocations();
    }, [fetchLocations]);

    return { locations, loading, error, refetch: fetchLocations };
}

// Hook for managing favorites
export function useFavorites(userId) {
    const [favorites, setFavorites] = useState(new Set());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userId) {
            const saved = localStorage.getItem(`favorites_${userId}`);
            if (saved) {
                setFavorites(new Set(JSON.parse(saved)));
            }
        }
    }, [userId]);

    const toggleFavorite = (petId) => {
        if (!userId) return false;

        const newFavorites = new Set(favorites);
        if (newFavorites.has(petId)) {
            newFavorites.delete(petId);
        } else {
            newFavorites.add(petId);
        }
        setFavorites(newFavorites);
        localStorage.setItem(`favorites_${userId}`, JSON.stringify([...newFavorites]));
        return true;
    };

    const isFavorite = (petId) => favorites.has(petId);

    return { favorites, toggleFavorite, isFavorite, loading };
}
