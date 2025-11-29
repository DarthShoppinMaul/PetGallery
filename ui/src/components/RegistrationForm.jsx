// RegistrationForm.jsx
// Registration form with validation

import React from 'react';
import { Link } from 'react-router-dom';
import PasswordStrengthIndicator from './PasswordStrengthIndicator.jsx';

export default function RegistrationForm({
    formData,
    errors,
    isSubmitting,
    passwordStrength,
    onChange,
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
                <label className="block mb-2 text-sm font-medium">Email *</label>
                <input
                    type="email"
                    name="email"
                    className={`input w-full ${errors.email ? 'border-red-500' : ''}`}
                    value={formData.email}
                    onChange={onChange}
                    disabled={isSubmitting}
                    placeholder="your@email.com"
                    data-cy="email-input"
                />
                {errors.email && (
                    <div className="text-red-400 text-sm mt-1">{errors.email}</div>
                )}
            </div>

            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Display Name *</label>
                <input
                    type="text"
                    name="displayName"
                    className={`input w-full ${errors.displayName ? 'border-red-500' : ''}`}
                    value={formData.displayName}
                    onChange={onChange}
                    disabled={isSubmitting}
                    placeholder="John Doe"
                    data-cy="displayName-input"
                />
                {errors.displayName && (
                    <div className="text-red-400 text-sm mt-1">{errors.displayName}</div>
                )}
            </div>

            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Phone (Optional)</label>
                <input
                    type="tel"
                    name="phone"
                    className={`input w-full ${errors.phone ? 'border-red-500' : ''}`}
                    value={formData.phone}
                    onChange={onChange}
                    disabled={isSubmitting}
                    placeholder="+1 (555) 123-4567"
                    data-cy="phone-input"
                />
                {errors.phone && (
                    <div className="text-red-400 text-sm mt-1">{errors.phone}</div>
                )}
            </div>

            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Password *</label>
                <input
                    type="password"
                    name="password"
                    className={`input w-full ${errors.password ? 'border-red-500' : ''}`}
                    value={formData.password}
                    onChange={onChange}
                    disabled={isSubmitting}
                    placeholder="******"
                    data-cy="password-input"
                />
                {errors.password && (
                    <div className="text-red-400 text-sm mt-1">{errors.password}</div>
                )}
                <PasswordStrengthIndicator strength={passwordStrength} />
            </div>

            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Confirm Password *</label>
                <input
                    type="password"
                    name="confirmPassword"
                    className={`input w-full ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    value={formData.confirmPassword}
                    onChange={onChange}
                    disabled={isSubmitting}
                    placeholder="******"
                    data-cy="confirm-password-input"
                />
                {errors.confirmPassword && (
                    <div className="text-red-400 text-sm mt-1">{errors.confirmPassword}</div>
                )}
            </div>

            <div className="mb-6">
                <label className="flex items-start cursor-pointer">
                    <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={onChange}
                        className="w-4 h-4 mt-1 rounded border-[#3a5a86] bg-[#143058] text-[#64FFDA] focus:ring-2 focus:ring-[#64FFDA] focus:ring-offset-0"
                        disabled={isSubmitting}
                    />
                    <span className="ml-2 text-sm">
                        I agree to the{' '}
                        <Link to="/terms" className="text-[#64FFDA] hover:underline">
                            Terms and Conditions
                        </Link>
                        {' '}and{' '}
                        <Link to="/privacy" className="text-[#64FFDA] hover:underline">
                            Privacy Policy
                        </Link>
                    </span>
                </label>
                {errors.agreeToTerms && (
                    <div className="text-red-400 text-sm mt-1">{errors.agreeToTerms}</div>
                )}
            </div>

            <button
                type="submit"
                className="btn w-full mb-4"
                disabled={isSubmitting}
                data-cy="register-button"
            >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="mt-6 text-sm text-center text-[#B6C6DA]">
                Already have an account?{' '}
                <Link to="/login" className="text-[#64FFDA] hover:underline font-medium" data-cy="login-link">
                    Login
                </Link>
            </div>
        </form>
    );
}
