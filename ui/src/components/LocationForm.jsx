// LocationForm.jsx
// Form for adding/editing locations

import React from 'react';

export default function LocationForm({
    name,
    address,
    phone,
    errors,
    isSubmitting,
    isEditing,
    onNameChange,
    onAddressChange,
    onPhoneChange,
    onSubmit,
    onCancel
}) {
    return (
        <form onSubmit={onSubmit}>
            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Location Name *</label>
                <input
                    className={`input w-full ${errors.name ? 'border-red-500' : ''}`}
                    value={name}
                    onChange={onNameChange}
                    placeholder="e.g., Downtown Adoption Center"
                    data-cy="location-name-input"
                />
                {errors.name && (
                    <div className="text-red-400 text-sm mt-1" data-cy="location-name-error">
                        {errors.name}
                    </div>
                )}
            </div>

            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Address *</label>
                <input
                    className={`input w-full ${errors.address ? 'border-red-500' : ''}`}
                    value={address}
                    onChange={onAddressChange}
                    placeholder="e.g., 123 Main St, Toronto, ON"
                    data-cy="location-address-input"
                />
                {errors.address && (
                    <div className="text-red-400 text-sm mt-1" data-cy="location-address-error">
                        {errors.address}
                    </div>
                )}
            </div>

            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Phone</label>
                <input
                    className={`input w-full ${errors.phone ? 'border-red-500' : ''}`}
                    value={phone}
                    onChange={onPhoneChange}
                    placeholder="e.g., (416) 555-0123"
                    data-cy="location-phone-input"
                />
                {errors.phone && (
                    <div className="text-red-400 text-sm mt-1" data-cy="location-phone-error">
                        {errors.phone}
                    </div>
                )}
            </div>

            <div className="h-4" />
            <button
                type="submit"
                className="btn"
                disabled={isSubmitting}
                data-cy={isEditing ? 'update-location-button' : 'add-location-button'}
            >
                {isSubmitting
                    ? (isEditing ? 'Updating Location...' : 'Adding Location...')
                    : (isEditing ? 'Update Location' : 'Add Location')
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
