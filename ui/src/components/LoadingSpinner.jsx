// LoadingSpinner.jsx
// Displays a loading indicator

import React from 'react';

export default function LoadingSpinner({ message = 'Loading...' }) {
    return (
        <div className="text-center py-8">
            <div className="text-[#B6C6DA]">{message}</div>
        </div>
    );
}
