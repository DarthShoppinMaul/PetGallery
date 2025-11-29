// locationHooks.js
// Custom hooks for location-related API operations

import { useState, useEffect, useCallback } from 'react';
import { locationsAPI } from '../services/api.js';

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

// Hook to create a new location
export function useCreateLocation() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createLocation = async (locationData) => {
        setLoading(true);
        setError(null);
        try {
            const result = await locationsAPI.create(locationData);
            return { success: true, data: result };
        } catch (err) {
            const errorMsg = err.response?.data?.detail || 'Failed to create location';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    };

    return { createLocation, loading, error };
}

// Hook to update an existing location
export function useUpdateLocation() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateLocation = async (locationId, locationData) => {
        setLoading(true);
        setError(null);
        try {
            const result = await locationsAPI.update(locationId, locationData);
            return { success: true, data: result };
        } catch (err) {
            const errorMsg = err.response?.data?.detail || 'Failed to update location';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    };

    return { updateLocation, loading, error };
}

// Hook to delete a location
export function useDeleteLocation() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteLocation = async (locationId) => {
        setLoading(true);
        setError(null);
        try {
            await locationsAPI.delete(locationId);
            return { success: true };
        } catch (err) {
            const errorMsg = err.response?.data?.detail || 'Failed to delete location';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    };

    return { deleteLocation, loading, error };
}
