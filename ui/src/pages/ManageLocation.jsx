// ManageLocation.jsx
// Admin page to manage locations

import React, { useState } from 'react';
import { useLocations, useCreateLocation, useUpdateLocation, useDeleteLocation } from '../hooks/locationHooks.js';
import LocationTable from '../components/LocationTable.jsx';
import LocationForm from '../components/LocationForm.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

function isValidPhoneClient(raw) {
    const v = (raw ?? "").trim();
    if (v === "") return true;
    const digits = v.replace(/\D/g, "");
    return digits.length >= 10;
}

export default function ManageLocation() {
    const { locations, loading, refetch } = useLocations();
    const { createLocation } = useCreateLocation();
    const { updateLocation } = useUpdateLocation();
    const { deleteLocation } = useDeleteLocation();

    const [viewMode, setViewMode] = useState('list');
    const [editingLocationId, setEditingLocationId] = useState(null);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const validateForm = () => {
        const newErrors = {};

        if (!name.trim()) {
            newErrors.name = 'Location name is required';
        } else if (name.trim().length < 3) {
            newErrors.name = 'Location name must be at least 3 characters';
        }

        if (!address.trim()) {
            newErrors.address = 'Address is required';
        }

        if (!isValidPhoneClient(phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        const data = {
            name: name.trim(),
            address: address.trim(),
            phone: (phone || '').trim(),
        };

        let result;
        if (viewMode === 'edit') {
            result = await updateLocation(editingLocationId, data);
            if (result.success) setSuccessMessage('Location updated successfully!');
        } else {
            result = await createLocation(data);
            if (result.success) setSuccessMessage('Location added successfully!');
        }

        if (!result.success) {
            setErrors({ submit: result.error });
        } else {
            await refetch();
            handleCancel();
        }

        setIsSubmitting(false);
    };

    const handleEdit = (location) => {
        setEditingLocationId(location.location_id);
        setName(location.name);
        setAddress(location.address);
        setPhone(location.phone || '');
        setViewMode('edit');
        setSuccessMessage('');
        setErrors({});
    };

    const handleDelete = async (locationId) => {
        if (!window.confirm('Are you sure you want to delete this location?')) return;

        const result = await deleteLocation(locationId);
        if (result.success) {
            setSuccessMessage('Location deleted successfully!');
            await refetch();
        } else {
            setErrors({ submit: result.error });
        }
    };

    const handleAddNew = () => {
        setViewMode('add');
        clearForm();
        setSuccessMessage('');
    };

    const handleCancel = () => {
        setViewMode('list');
        clearForm();
    };

    const clearForm = () => {
        setEditingLocationId(null);
        setName('');
        setAddress('');
        setPhone('');
        setErrors({});
    };

    if (loading) {
        return <LoadingSpinner message="Loading locations..." />;
    }

    if (viewMode === 'list') {
        return (
            <div className="container-narrow">
                <h1 className="text-3xl mb-6">Manage Locations</h1>

                {successMessage && (
                    <div className="mb-4 p-3 bg-green-900/30 border border-green-500 text-green-400 rounded-xl">
                        {successMessage}
                    </div>
                )}

                {errors.submit && (
                    <div className="mb-4 p-3 bg-red-900/30 border border-red-500 text-red-400 rounded-xl">
                        {errors.submit}
                    </div>
                )}

                <div className="mb-4">
                    <button className="btn" onClick={handleAddNew} data-cy="add-new-location-button">
                        Add New Location
                    </button>
                </div>

                <div className="panel overflow-x-auto">
                    <h2 className="text-xl font-bold mb-4">All Locations ({locations.length})</h2>
                    <LocationTable
                        locations={locations}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="container-narrow">
            <h1 className="text-3xl mb-6">{viewMode === 'edit' ? 'Edit Location' : 'Add Location'}</h1>

            <div className="panel">
                {errors.submit && (
                    <div className="mb-4 p-3 bg-red-900/30 border border-red-500 text-red-400 rounded-xl">
                        {errors.submit}
                    </div>
                )}

                <LocationForm
                    name={name}
                    address={address}
                    phone={phone}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    isEditing={viewMode === 'edit'}
                    onNameChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors({ ...errors, name: undefined });
                    }}
                    onAddressChange={(e) => {
                        setAddress(e.target.value);
                        if (errors.address) setErrors({ ...errors, address: undefined });
                    }}
                    onPhoneChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors({ ...errors, phone: undefined });
                    }}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
}
