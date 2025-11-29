// LoginForm.jsx
// Login form with email/password fields

import React from 'react';
import { Link } from 'react-router-dom';

export default function LoginForm({
    email,
    password,
    rememberMe,
    errors,
    isSubmitting,
    onEmailChange,
    onPasswordChange,
    onRememberMeChange,
    onSubmit
}) {
    return (
        <form onSubmit={onSubmit}>
            {errors.submit && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-500 text-red-400 rounded-xl">
                    {errors.submit}
                </div>
            )}

            <div className="mb-4">
                <label htmlFor="email" className="block mb-2 text-sm font-medium">Email</label>
                <input
                    id="email"
                    type="email"
                    className={`input w-full ${errors.email ? 'border-red-500' : ''}`}
                    value={email}
                    onChange={onEmailChange}
                    disabled={isSubmitting}
                    placeholder="your@email.com"
                    data-cy="email-input"
                    required
                />
                {errors.email && (
                    <div className="text-red-400 text-sm mt-1" data-cy="email-error">
                        {errors.email}
                    </div>
                )}
            </div>

            <div className="mb-4">
                <label htmlFor="password" className="block mb-2 text-sm font-medium">Password</label>
                <input
                    id="password"
                    type="password"
                    className={`input w-full ${errors.password ? 'border-red-500' : ''}`}
                    value={password}
                    onChange={onPasswordChange}
                    disabled={isSubmitting}
                    placeholder="******"
                    data-cy="password-input"
                    required
                />
                {errors.password && (
                    <div className="text-red-400 text-sm mt-1" data-cy="password-error">
                        {errors.password}
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between mb-6">
                <label className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={onRememberMeChange}
                        className="w-4 h-4 rounded border-[#3a5a86] bg-[#143058] text-[#64FFDA] focus:ring-2 focus:ring-[#64FFDA] focus:ring-offset-0"
                        disabled={isSubmitting}
                        data-cy="remember-me-checkbox"
                    />
                    <span className="ml-2 text-sm">Remember me for 7 days</span>
                </label>
            </div>

            <button
                type="submit"
                className="btn w-full mb-4"
                disabled={isSubmitting}
                data-cy="login-button"
            >
                {isSubmitting ? 'Logging in...' : 'Login'}
            </button>

            <div className="mt-6 text-sm text-center text-[#B6C6DA]">
                Don't have an account?{' '}
                <Link to="/register" className="text-[#64FFDA] hover:underline font-medium" data-cy="register-link">
                    Sign up
                </Link>
            </div>
        </form>
    );
}
