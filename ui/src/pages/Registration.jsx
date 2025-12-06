// Registration.jsx
// New user registration page with form validation and Google OAuth option
// Includes password strength indicator and terms agreement requirement

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import RegistrationForm from '../components/RegistrationForm.jsx';
import GoogleSignInButton from '../components/GoogleSignInButton.jsx';
import Divider from '../components/Divider.jsx';

export default function Registration() {
    const { register } = useAuth();
    const navigate = useNavigate();

    // Form field state
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        displayName: '',
        phone: '',
        agreeToTerms: false
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('');

    // Evaluate password strength based on length and complexity
    const calculatePasswordStrength = (password) => {
        if (!password) return '';
        if (password.length < 6) return 'weak';
        if (password.length < 10) return 'medium';
        if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
            return 'strong';
        }
        return 'medium';
    };

    // Handle form field changes and update password strength
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({ ...prev, [name]: newValue }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }

        if (name === 'password') {
            setPasswordStrength(calculatePasswordStrength(value));
        }
    };

    // Validate all form fields before submission
    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.displayName.trim()) {
            newErrors.displayName = 'Display name is required';
        } else if (formData.displayName.length < 2) {
            newErrors.displayName = 'Display name must be at least 2 characters';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (formData.phone && !/^\+?[\d\s\-()]+$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = 'You must agree to the terms and conditions';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Submit registration to authentication API
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await register(formData);
            if (result.success) {
                navigate('/login');
            } else {
                setErrors({ submit: result.error });
            }
        } catch (err) {
            setErrors({ submit: 'Registration failed. Please try again.' });
        }

        setIsSubmitting(false);
    };

    return (
        <div className="container-narrow">
            <h1 className="text-3xl mb-6 text-center">Create Your Account</h1>

            <div className="panel max-w-md mx-auto">
                <RegistrationForm
                    formData={formData}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    passwordStrength={passwordStrength}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                />

                <Divider text="Or sign up with" />

                <GoogleSignInButton disabled={isSubmitting} />
            </div>
        </div>
    );
}