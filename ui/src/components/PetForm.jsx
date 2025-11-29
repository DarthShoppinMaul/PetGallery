// PetForm.jsx
// Form for adding/editing pets with photo upload

import React from 'react';
import ImageFileInput from './ImageFileInput.jsx';

export default function PetForm({
    name,
    species,
    age,
    locationId,
    description,
    photo,
    currentPhotoUrl,
    locations,
    errors,
    isSubmitting,
    isEditing,
    onNameChange,
    onSpeciesChange,
    onAgeChange,
    onLocationChange,
    onDescriptionChange,
    onPhotoChange,
    onSubmit,
    onCancel
}) {
    return (
        <form onSubmit={onSubmit}>
            <div className="flex flex-wrap gap-4">
                <div className="min-w-[240px] flex-1">
                    <label className="block mb-2 text-sm font-medium">Pet Name *</label>
                    <input
                        className={`input ${errors.name ? 'border-red-500' : ''}`}
                        value={name}
                        onChange={onNameChange}
                        data-cy="pet-name-input"
                    />
                    {errors.name && (
                        <div className="text-red-400 text-sm mt-1" data-cy="pet-name-error">
                            {errors.name}
                        </div>
                    )}
                </div>

                <div className="min-w-[240px] flex-1">
                    <label className="block mb-2 text-sm font-medium">Species *</label>
                    <input
                        className={`input ${errors.species ? 'border-red-500' : ''}`}
                        value={species}
                        onChange={onSpeciesChange}
                        data-cy="pet-species-input"
                    />
                    {errors.species && (
                        <div className="text-red-400 text-sm mt-1" data-cy="pet-species-error">
                            {errors.species}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
                <div className="max-w-[200px] flex-1">
                    <label className="block mb-2 text-sm font-medium">Age (years) *</label>
                    <input
                        className={`input ${errors.age ? 'border-red-500' : ''}`}
                        type="number"
                        min="0"
                        step="1"
                        value={age}
                        onChange={onAgeChange}
                        data-cy="pet-age-input"
                    />
                    {errors.age && (
                        <div className="text-red-400 text-sm mt-1" data-cy="pet-age-error">
                            {errors.age}
                        </div>
                    )}
                </div>

                <div className="min-w-[240px] flex-1">
                    <label className="block mb-2 text-sm font-medium">Location *</label>
                    <select
                        className={`input ${errors.locationId ? 'border-red-500' : ''}`}
                        value={locationId}
                        onChange={onLocationChange}
                        data-cy="pet-location-select"
                    >
                        <option value="">Select a location</option>
                        {locations.map(loc => (
                            <option key={loc.location_id} value={loc.location_id}>
                                {loc.name}
                            </option>
                        ))}
                    </select>
                    {errors.locationId && (
                        <div className="text-red-400 text-sm mt-1" data-cy="pet-location-error">
                            {errors.locationId}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4">
                <label className="block mb-2 text-sm font-medium">Description</label>
                <textarea
                    className="textarea"
                    value={description}
                    onChange={onDescriptionChange}
                    rows="4"
                    data-cy="pet-description-input"
                />
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
                <div className="max-w-[400px] flex-1">
                    <ImageFileInput
                        id="pet-photo"
                        label={isEditing ? "Photo - Leave empty to keep current photo" : "Photo"}
                        currentImageUrl={currentPhotoUrl}
                        selectedFile={photo}
                        onChange={onPhotoChange}
                        error={errors.photo}
                        showCurrentImage={isEditing}
                    />
                </div>
            </div>

            <div className="h-4" />
            <button
                type="submit"
                className="btn"
                disabled={isSubmitting}
                data-cy={isEditing ? 'update-pet-button' : 'add-pet-button'}
            >
                {isSubmitting
                    ? (isEditing ? 'Updating Pet...' : 'Adding Pet...')
                    : (isEditing ? 'Update Pet' : 'Add Pet')
                }
            </button>
            <button
                type="button"
                className="btn-secondary ml-2"
                onClick={onCancel}
                disabled={isSubmitting}
                data-cy="cancel-button"
            >
                Cancel
            </button>
        </form>
    );
}
