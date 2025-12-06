// AdoptionApplicationForm.jsx
// Allows authenticated users to submit an adoption application for a specific pet
// Includes form validation, pet preview sidebar, and submission handling

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { usePet } from '../hooks/petHooks.js';
import { useCreateApplication } from '../hooks/applicationHooks.js';
import { API_BASE_URL } from '../services/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ApplicationForm from '../components/ApplicationForm.jsx';

export default function AdoptionApplicationForm() {
    const { petId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Fetch pet details and application submission hook
    const { pet, loading } = usePet(petId);
    const { createApplication, loading: submitting } = useCreateApplication();

    // Form state management
    const [formData, setFormData] = useState({
        applicationMessage: '',
        contactPhone: user?.phone || '',
        livingSituation: '',
        hasOtherPets: false,
        otherPetsDetails: ''
    });
    const [errors, setErrors] = useState({});

    // Redirect unauthenticated users to login
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    // Handle form field changes and clear related errors
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({ ...prev, [name]: newValue }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    // Validate all form fields before submission
    const validateForm = () => {
        const newErrors = {};

        if (!formData.applicationMessage.trim()) {
            newErrors.applicationMessage = 'Please tell us why you want to adopt this pet';
        } else if (formData.applicationMessage.length < 50) {
            newErrors.applicationMessage = 'Please provide more details (at least 50 characters)';
        }

        if (!formData.contactPhone.trim()) {
            newErrors.contactPhone = 'Contact phone is required';
        } else if (!/^\+?[\d\s\-()]+$/.test(formData.contactPhone)) {
            newErrors.contactPhone = 'Please enter a valid phone number';
        }

        if (!formData.livingSituation) {
            newErrors.livingSituation = 'Please select your living situation';
        }

        if (formData.hasOtherPets && !formData.otherPetsDetails.trim()) {
            newErrors.otherPetsDetails = 'Please provide details about your other pets';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Submit application to backend API
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const applicationData = {
            pet_id: parseInt(petId),
            application_message: formData.applicationMessage,
            contact_phone: formData.contactPhone,
            living_situation: formData.livingSituation,
            has_other_pets: formData.hasOtherPets,
            other_pets_details: formData.hasOtherPets ? formData.otherPetsDetails : ''
        };

        const result = await createApplication(applicationData);

        if (result.success) {
            navigate('/my-applications');
        } else {
            setErrors({ submit: result.error });
        }
    };

    if (loading) {
        return <LoadingSpinner message="Loading pet details..." />;
    }

    if (!pet) {
        return (
            <div className="container-narrow">
                <div className="text-center py-8 text-red-400">Pet not found</div>
            </div>
        );
    }

    return (
        <div className="container-narrow">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-[#64FFDA] hover:underline flex items-center gap-2"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
            </button>

            <h1 className="text-3xl mb-6">Apply to Adopt {pet.name}</h1>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <div className="panel sticky top-4">
                        <div
                            className="w-full h-48 bg-[#152e56] rounded-xl bg-cover bg-center mb-4"
                            style={{
                                backgroundImage: pet.photo_url
                                    ? `url(${API_BASE_URL}/${pet.photo_url})`
                                    : undefined
                            }}
                        />
                        <h2 className="text-xl font-semibold mb-2">{pet.name}</h2>
                        <div className="text-[#B6C6DA] text-sm">
                            {pet.species} â€¢ {pet.age} {pet.age === 1 ? 'year' : 'years'} old
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <div className="panel">
                        {errors.submit && (
                            <div className="mb-4 p-3 bg-red-900/30 border border-red-500 text-red-400 rounded-xl">
                                {errors.submit}
                            </div>
                        )}

                        <ApplicationForm
                            formData={formData}
                            errors={errors}
                            isSubmitting={submitting}
                            onChange={handleChange}
                            onSubmit={handleSubmit}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}