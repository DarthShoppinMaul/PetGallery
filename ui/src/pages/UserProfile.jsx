// UserProfile.jsx
// User profile page for viewing and editing own account

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useUpdateUser, useDeleteUser } from '../hooks/userHooks.js';
import ProfileInfo from '../components/ProfileInfo.jsx';
import ProfileEditForm from '../components/ProfileEditForm.jsx';
import DeleteAccountSection from '../components/DeleteAccountSection.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

export default function UserProfile() {
    const { user: currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const { updateUser } = useUpdateUser();
    const { deleteUser } = useDeleteUser();

    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const [formData, setFormData] = useState({
        display_name: '',
        email: '',
        password: '',
        confirm_password: ''
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (currentUser) {
            setFormData({
                display_name: currentUser.display_name || '',
                email: currentUser.email || '',
                password: '',
                confirm_password: ''
            });
        }
    }, [currentUser]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (formErrors[name]) {
            setFormErrors({ ...formErrors, [name]: null });
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.display_name.trim()) {
            errors.display_name = 'Display name is required';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }

        if (formData.password) {
            if (formData.password.length < 6) {
                errors.password = 'Password must be at least 6 characters';
            }
            if (formData.password !== formData.confirm_password) {
                errors.confirm_password = 'Passwords do not match';
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        setError(null);

        const updateData = {
            display_name: formData.display_name,
            email: formData.email
        };

        if (formData.password) {
            updateData.password = formData.password;
        }

        const result = await updateUser(currentUser.user_id, updateData);

        if (result.success) {
            setSuccessMessage('Profile updated successfully!');
            setIsEditing(false);
            setFormData({ ...formData, password: '', confirm_password: '' });
        } else {
            setError(result.error);
        }

        setIsSubmitting(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setFormData({
            display_name: currentUser.display_name || '',
            email: currentUser.email || '',
            password: '',
            confirm_password: ''
        });
        setFormErrors({});
    };

    const handleDeleteAccount = async () => {
        setIsSubmitting(true);
        setError(null);

        const result = await deleteUser(currentUser.user_id);

        if (result.success) {
            await logout();
            navigate('/');
        } else {
            setError(result.error);
            setIsSubmitting(false);
        }
    };

    if (!currentUser) {
        return <LoadingSpinner message="Loading profile..." />;
    }

    return (
        <div className="container-narrow">
            <h1 className="text-3xl mb-6">My Profile</h1>

            {successMessage && (
                <div className="mb-4 p-3 bg-green-900/30 border border-green-500 text-green-400 rounded-xl">
                    {successMessage}
                </div>
            )}

            {error && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-500 text-red-400 rounded-xl">
                    {error}
                </div>
            )}

            {isEditing ? (
                <ProfileEditForm
                    formData={formData}
                    formErrors={formErrors}
                    onChange={handleInputChange}
                    onSubmit={handleSubmit}
                    onCancel={handleCancelEdit}
                    isSubmitting={isSubmitting}
                />
            ) : (
                <ProfileInfo
                    user={currentUser}
                    onEdit={() => setIsEditing(true)}
                />
            )}

            <DeleteAccountSection
                showConfirm={showDeleteConfirm}
                onShowConfirm={() => setShowDeleteConfirm(true)}
                onConfirmDelete={handleDeleteAccount}
                onCancelDelete={() => setShowDeleteConfirm(false)}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}
