// ManagePet.jsx
// Admin page to manage pets

import React, { useState } from 'react';
import { usePets, useLocations, useCreatePet, useUpdatePet, useDeletePet } from '../hooks/petHooks.js';
import PetTable from '../components/PetTable.jsx';
import PetForm from '../components/PetForm.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function ManagePet() {
    const { pets, loading: petsLoading, refetch: refetchPets } = usePets();
    const { locations, loading: locationsLoading } = useLocations();
    const { createPet } = useCreatePet();
    const { updatePet } = useUpdatePet();
    const { deletePet } = useDeletePet();

    const [viewMode, setViewMode] = useState('list');
    const [editingPetId, setEditingPetId] = useState(null);
    const [name, setName] = useState('');
    const [species, setSpecies] = useState('');
    const [age, setAge] = useState('');
    const [locationId, setLocationId] = useState('');
    const [description, setDescription] = useState('');
    const [photo, setPhoto] = useState(null);
    const [currentPhotoUrl, setCurrentPhotoUrl] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const validateForm = () => {
        const newErrors = {};

        if (!name.trim()) {
            newErrors.name = 'Pet name is required';
        } else if (name.trim().length < 2) {
            newErrors.name = 'Pet name must be at least 2 characters';
        }

        if (!species.trim()) {
            newErrors.species = 'Species is required';
        }

        if (!age) {
            newErrors.age = 'Age is required';
        } else {
            const ageNum = parseInt(age, 10);
            if (isNaN(ageNum) || ageNum < 0) {
                newErrors.age = 'Age must be 0 or greater';
            } else if (ageNum > 30) {
                newErrors.age = 'Age seems too high (max 30 years)';
            }
        }

        if (!locationId) {
            newErrors.locationId = 'Please select a location';
        }

        if (photo) {
            if (photo.size > MAX_FILE_SIZE_BYTES) {
                newErrors.photo = `File size must be less than ${MAX_FILE_SIZE_MB}MB`;
            }
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(photo.type)) {
                newErrors.photo = 'File must be an image (JPEG, PNG, GIF, or WebP)';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('name', name.trim());
        formData.append('species', species.trim());
        formData.append('age', parseInt(age, 10));
        formData.append('location_id', parseInt(locationId, 10));

        if (description.trim()) {
            formData.append('description', description.trim());
        }

        if (photo) {
            formData.append('photo', photo);
        }

        let result;
        if (viewMode === 'edit') {
            result = await updatePet(editingPetId, formData);
            if (result.success) setSuccessMessage('Pet updated successfully!');
        } else {
            result = await createPet(formData);
            if (result.success) setSuccessMessage('Pet added successfully!');
        }

        if (!result.success) {
            setErrors({ submit: result.error });
        } else {
            await refetchPets();
            handleCancel();
        }

        setIsSubmitting(false);
    };

    const handleEdit = (pet) => {
        setEditingPetId(pet.pet_id);
        setName(pet.name);
        setSpecies(pet.species);
        setAge(pet.age.toString());
        setLocationId(pet.location_id.toString());
        setDescription(pet.description || '');
        setCurrentPhotoUrl(pet.photo_url || '');
        setPhoto(null);
        setViewMode('edit');
        setSuccessMessage('');
        setErrors({});
    };

    const handleDelete = async (petId) => {
        const pet = pets.find(p => p.pet_id === petId);
        if (!window.confirm(`Are you sure you want to delete ${pet?.name || 'this pet'}?`)) return;

        const result = await deletePet(petId);
        if (result.success) {
            setSuccessMessage('Pet deleted successfully!');
            await refetchPets();
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
        setEditingPetId(null);
        setName('');
        setSpecies('');
        setAge('');
        setLocationId('');
        setDescription('');
        setPhoto(null);
        setCurrentPhotoUrl('');
        setErrors({});
    };

    const handlePhotoChange = (file, error) => {
        setPhoto(file);
        if (error) {
            setErrors({ ...errors, photo: error });
        } else if (errors.photo) {
            setErrors({ ...errors, photo: undefined });
        }
    };

    if (petsLoading || locationsLoading) {
        return <LoadingSpinner message="Loading..." />;
    }

    if (viewMode === 'list') {
        return (
            <div className="container-narrow">
                <h1 className="text-3xl mb-6">Manage Pets</h1>

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
                    <button className="btn" onClick={handleAddNew} data-cy="add-new-pet-button">
                        Add New Pet
                    </button>
                </div>

                <div className="panel overflow-x-auto">
                    <h2 className="text-xl font-bold mb-4">All Pets ({pets.length})</h2>
                    <PetTable
                        pets={pets}
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
            <h1 className="text-3xl mb-6">{viewMode === 'edit' ? 'Edit Pet' : 'Add Pet'}</h1>

            <div className="panel">
                {errors.submit && (
                    <div className="mb-4 p-3 bg-red-900/30 border border-red-500 text-red-400 rounded-xl">
                        {errors.submit}
                    </div>
                )}

                <PetForm
                    name={name}
                    species={species}
                    age={age}
                    locationId={locationId}
                    description={description}
                    photo={photo}
                    currentPhotoUrl={currentPhotoUrl}
                    locations={locations}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    isEditing={viewMode === 'edit'}
                    onNameChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors({ ...errors, name: undefined });
                    }}
                    onSpeciesChange={(e) => {
                        setSpecies(e.target.value);
                        if (errors.species) setErrors({ ...errors, species: undefined });
                    }}
                    onAgeChange={(e) => {
                        setAge(e.target.value);
                        if (errors.age) setErrors({ ...errors, age: undefined });
                    }}
                    onLocationChange={(e) => {
                        setLocationId(e.target.value);
                        if (errors.locationId) setErrors({ ...errors, locationId: undefined });
                    }}
                    onDescriptionChange={(e) => setDescription(e.target.value)}
                    onPhotoChange={handlePhotoChange}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
}
