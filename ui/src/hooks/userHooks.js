// userHooks.js
// Custom hooks for user-related API operations

import { useState, useEffect, useCallback } from 'react';
import { usersAPI } from '../services/api.js';

// Hook to fetch all users
export function useUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await usersAPI.list();
            setUsers(data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return { users, loading, error, refetch: fetchUsers };
}

// Hook to fetch a single user by ID
export function useUser(userId) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUser = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        setError(null);
        try {
            const data = await usersAPI.get(userId);
            setUser(data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to load user');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return { user, loading, error, refetch: fetchUser };
}

// Hook to create a new user
export function useCreateUser() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createUser = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const result = await usersAPI.create(userData);
            return { success: true, data: result };
        } catch (err) {
            const errorMsg = err.response?.data?.detail || 'Failed to create user';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    };

    return { createUser, loading, error };
}

// Hook to update an existing user
export function useUpdateUser() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateUser = async (userId, userData) => {
        setLoading(true);
        setError(null);
        try {
            const result = await usersAPI.update(userId, userData);
            return { success: true, data: result };
        } catch (err) {
            const errorMsg = err.response?.data?.detail || 'Failed to update user';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    };

    return { updateUser, loading, error };
}

// Hook to delete a user
export function useDeleteUser() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteUser = async (userId) => {
        setLoading(true);
        setError(null);
        try {
            await usersAPI.delete(userId);
            return { success: true };
        } catch (err) {
            const errorMsg = err.response?.data?.detail || 'Failed to delete user';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    };

    return { deleteUser, loading, error };
}
