// Login.jsx
// Login page with JWT authentication and remember me feature

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import LoginForm from '../components/LoginForm.jsx';
import GoogleSignInButton from '../components/GoogleSignInButton.jsx';
import Divider from '../components/Divider.jsx';

export default function Login() {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/pets');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        const error = searchParams.get('error');
        if (error === 'oauth_failed') {
            setErrors({ submit: 'Google Sign-In failed. Please try again or use email/password.' });
        }
    }, [searchParams]);

    const validateForm = () => {
        const newErrors = {};

        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await login(email, password, rememberMe);

            if (result.success) {
                setIsSubmitting(false);
            } else {
                setErrors({ submit: result.error || 'Login failed' });
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrors({ submit: 'Login failed. Please try again.' });
            setIsSubmitting(false);
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (errors.email) {
            setErrors({ ...errors, email: undefined });
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (errors.password) {
            setErrors({ ...errors, password: undefined });
        }
    };

    return (
        <div className="container-narrow">
            <h1 className="text-3xl mb-6 text-center">Login</h1>

            <div className="panel max-w-md mx-auto">
                <LoginForm
                    email={email}
                    password={password}
                    rememberMe={rememberMe}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    onEmailChange={handleEmailChange}
                    onPasswordChange={handlePasswordChange}
                    onRememberMeChange={(e) => setRememberMe(e.target.checked)}
                    onSubmit={handleSubmit}
                />

                <Divider text="Or continue with" />

                <GoogleSignInButton disabled={isSubmitting} />
            </div>
        </div>
    );
}
