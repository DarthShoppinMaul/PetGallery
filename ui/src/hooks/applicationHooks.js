// applicationHooks.js
// Custom hooks for adoption application API operations

import { useState, useEffect, useCallback } from 'react';
import { applicationsAPI } from '../services/api.js';

// Hook to fetch all applications
export function useApplications(status = null) {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchApplications = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await applicationsAPI.list(status);
            setApplications(data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to load applications');
        } finally {
            setLoading(false);
        }
    }, [status]);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    return { applications, loading, error, refetch: fetchApplications };
}

// Hook to fetch a single application by ID
export function useApplication(applicationId) {
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchApplication = useCallback(async () => {
        if (!applicationId) return;
        setLoading(true);
        setError(null);
        try {
            const data = await applicationsAPI.get(applicationId);
            setApplication(data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to load application');
        } finally {
            setLoading(false);
        }
    }, [applicationId]);

    useEffect(() => {
        fetchApplication();
    }, [fetchApplication]);

    return { application, loading, error, refetch: fetchApplication };
}

// Hook to create a new application
export function useCreateApplication() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createApplication = async (applicationData) => {
        setLoading(true);
        setError(null);
        try {
            const result = await applicationsAPI.create(applicationData);
            return { success: true, data: result };
        } catch (err) {
            const errorMsg = err.response?.data?.detail || 'Failed to submit application';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    };

    return { createApplication, loading, error };
}

// Hook to update an application status
export function useUpdateApplication() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateApplication = async (applicationId, updateData) => {
        setLoading(true);
        setError(null);
        try {
            const result = await applicationsAPI.update(applicationId, updateData);
            return { success: true, data: result };
        } catch (err) {
            const errorMsg = err.response?.data?.detail || 'Failed to update application';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    };

    return { updateApplication, loading, error };
}

// Hook to delete an application
export function useDeleteApplication() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteApplication = async (applicationId) => {
        setLoading(true);
        setError(null);
        try {
            await applicationsAPI.delete(applicationId);
            return { success: true };
        } catch (err) {
            const errorMsg = err.response?.data?.detail || 'Failed to delete application';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    };

    return { deleteApplication, loading, error };
}

// Hook to fetch application stats
export function useApplicationStats() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await applicationsAPI.getStats();
            setStats(data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to load stats');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return { stats, loading, error, refetch: fetchStats };
}
