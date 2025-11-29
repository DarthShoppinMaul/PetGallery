// ApplicationForm.jsx
// Form for submitting adoption applications

import React from 'react';

export default function ApplicationForm({
    formData,
    errors,
    isSubmitting,
    onChange,
    onSubmit
}) {
    return (
        <form onSubmit={onSubmit}>
            <div className="mb-6">
                <label className="block mb-2 text-sm font-medium">
                    Why do you want to adopt this pet? *
                </label>
                <textarea
                    name="applicationMessage"
                    className={`textarea w-full ${errors.applicationMessage ? 'border-red-500' : ''}`}
                    value={formData.applicationMessage}
                    onChange={onChange}
                    rows="5"
                    placeholder="Tell us about yourself, your home environment, and why you'd be a great fit..."
                    disabled={isSubmitting}
                    data-cy="application-message-input"
                />
                {errors.applicationMessage && (
                    <div className="text-red-400 text-sm mt-1">{errors.applicationMessage}</div>
                )}
                <div className="text-[#B6C6DA] text-xs mt-1">
                    {formData.applicationMessage.length}/50 characters minimum
                </div>
            </div>

            <div className="mb-6">
                <label className="block mb-2 text-sm font-medium">Contact Phone *</label>
                <input
                    type="tel"
                    name="contactPhone"
                    className={`input w-full ${errors.contactPhone ? 'border-red-500' : ''}`}
                    value={formData.contactPhone}
                    onChange={onChange}
                    placeholder="+1 (555) 123-4567"
                    disabled={isSubmitting}
                    data-cy="contact-phone-input"
                />
                {errors.contactPhone && (
                    <div className="text-red-400 text-sm mt-1">{errors.contactPhone}</div>
                )}
            </div>

            <div className="mb-6">
                <label className="block mb-2 text-sm font-medium">Living Situation *</label>
                <select
                    name="livingSituation"
                    className={`input w-full ${errors.livingSituation ? 'border-red-500' : ''}`}
                    value={formData.livingSituation}
                    onChange={onChange}
                    disabled={isSubmitting}
                    data-cy="living-situation-select"
                >
                    <option value="">Select your living situation</option>
                    <option value="house_owned">House - Owned</option>
                    <option value="house_rented">House - Rented</option>
                    <option value="apartment_owned">Apartment/Condo - Owned</option>
                    <option value="apartment_rented">Apartment/Condo - Rented</option>
                    <option value="other">Other</option>
                </select>
                {errors.livingSituation && (
                    <div className="text-red-400 text-sm mt-1">{errors.livingSituation}</div>
                )}
            </div>

            <div className="mb-6">
                <label className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        name="hasOtherPets"
                        checked={formData.hasOtherPets}
                        onChange={onChange}
                        className="w-4 h-4 rounded border-[#3a5a86] bg-[#143058] text-[#64FFDA]"
                        disabled={isSubmitting}
                    />
                    <span className="ml-2">I have other pets at home</span>
                </label>
            </div>

            {formData.hasOtherPets && (
                <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium">
                        Please describe your other pets *
                    </label>
                    <textarea
                        name="otherPetsDetails"
                        className={`textarea w-full ${errors.otherPetsDetails ? 'border-red-500' : ''}`}
                        value={formData.otherPetsDetails}
                        onChange={onChange}
                        rows="3"
                        placeholder="Species, age, temperament..."
                        disabled={isSubmitting}
                        data-cy="other-pets-input"
                    />
                    {errors.otherPetsDetails && (
                        <div className="text-red-400 text-sm mt-1">{errors.otherPetsDetails}</div>
                    )}
                </div>
            )}

            <button
                type="submit"
                className="btn w-full text-lg py-3"
                disabled={isSubmitting}
                data-cy="submit-application-button"
            >
                {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
            </button>
        </form>
    );
}
