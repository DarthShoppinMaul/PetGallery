// UserManagement.jsx
// Admin page to manage all users

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../hooks/userHooks.js';
import UserTable from '../components/UserTable.jsx';
import CreateUserForm from '../components/CreateUserForm.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export default function UserManagement() {
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();

    const { users, loading, error, refetch } = useUsers();
    const { createUser } = useCreateUser();
    const { updateUser } = useUpdateUser();
    const { deleteUser } = useDeleteUser();

    const [editingId, setEditingId] = useState(null);
    const [editedUser, setEditedUser] = useState({});
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newUser, setNewUser] = useState({
        email: '',
        password: '',
        display_name: '',
        is_admin: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [actionError, setActionError] = useState(null);

    useEffect(() => {
        if (currentUser && !currentUser.is_admin) {
            navigate('/');
        }
    }, [currentUser, navigate]);

    const handleEditClick = (user) => {
        setEditingId(user.user_id);
        setEditedUser({
            display_name: user.display_name,
            email: user.email,
            password: ''
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditedUser({});
    };

    const handleEditChange = (field, value) => {
        setEditedUser(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveEdit = async (userId) => {
        setIsSubmitting(true);
        setActionError(null);

        const updateData = {
            display_name: editedUser.display_name,
            email: editedUser.email
        };

        if (editedUser.password) {
            updateData.password = editedUser.password;
        }

        const result = await updateUser(userId, updateData);

        if (result.success) {
            setSuccessMessage('User updated successfully!');
            setEditingId(null);
            setEditedUser({});
            await refetch();
        } else {
            setActionError(result.error);
        }

        setIsSubmitting(false);
    };

    const handleDeleteClick = async (userId) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        setIsSubmitting(true);
        setActionError(null);

        const result = await deleteUser(userId);

        if (result.success) {
            setSuccessMessage('User deleted successfully!');
            await refetch();
        } else {
            setActionError(result.error);
        }

        setIsSubmitting(false);
    };

    const handleNewUserChange = (field, value) => {
        setNewUser(prev => ({ ...prev, [field]: value }));
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setActionError(null);

        const result = await createUser(newUser);

        if (result.success) {
            setSuccessMessage('User created successfully!');
            setShowCreateForm(false);
            setNewUser({ email: '', password: '', display_name: '', is_admin: false });
            await refetch();
        } else {
            setActionError(result.error);
        }

        setIsSubmitting(false);
    };

    if (loading) {
        return <LoadingSpinner message="Loading users..." />;
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={refetch} />;
    }

    return (
        <div className="container-narrow">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl">User Management</h1>
                {!showCreateForm && (
                    <button
                        className="btn"
                        onClick={() => setShowCreateForm(true)}
                        data-cy="add-user-button"
                    >
                        Add New User
                    </button>
                )}
            </div>

            {successMessage && (
                <div className="mb-4 p-3 bg-green-900/30 border border-green-500 text-green-400 rounded-xl">
                    {successMessage}
                </div>
            )}

            {actionError && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-500 text-red-400 rounded-xl">
                    {actionError}
                </div>
            )}

            {showCreateForm && (
                <CreateUserForm
                    formData={newUser}
                    onChange={handleNewUserChange}
                    onSubmit={handleCreateUser}
                    onCancel={() => setShowCreateForm(false)}
                    isSubmitting={isSubmitting}
                />
            )}

            <div className="panel overflow-x-auto">
                <h2 className="text-xl font-bold mb-4">All Users ({users.length})</h2>
                <UserTable
                    users={users}
                    currentUserId={currentUser?.user_id}
                    editingId={editingId}
                    editedUser={editedUser}
                    onEditClick={handleEditClick}
                    onCancelEdit={handleCancelEdit}
                    onSaveEdit={handleSaveEdit}
                    onEditChange={handleEditChange}
                    onDeleteClick={handleDeleteClick}
                />
            </div>
        </div>
    );
}
