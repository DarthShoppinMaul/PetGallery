// ErrorMessage.jsx
// Displays error messages with optional retry button

import React from 'react';

export default function ErrorMessage({ message, onRetry }) {
    return (
        <div className="text-center py-8">
            <div className="text-red-500 mb-4">{message}</div>
            {onRetry && (
                <button onClick={onRetry} className="btn">
                    Try Again
                </button>
            )}
        </div>
    );
}