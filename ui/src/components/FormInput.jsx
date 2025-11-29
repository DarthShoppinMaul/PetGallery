// FormInput.jsx
// Reusable form input component with validation display

import React from 'react';

function FormInput({ 
    id, 
    label, 
    type = 'text', 
    value, 
    onChange, 
    error, 
    placeholder,
    disabled = false,
    required = false,
    className = '',
    ...props 
}) {
    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label htmlFor={id} className="block mb-2 text-sm font-medium">
                    {label}{required && ' *'}
                </label>
            )}
            <input
                id={id}
                type={type}
                className={`input w-full ${error ? 'border-red-500' : ''}`}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                data-cy={`${id}-input`}
                {...props}
            />
            {error && (
                <div className="text-red-400 text-sm mt-1" data-cy={`${id}-error`}>
                    {error}
                </div>
            )}
        </div>
    );
}

export default FormInput;
