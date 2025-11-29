// PasswordStrengthIndicator.jsx
// Visual indicator for password strength

import React from 'react';

export default function PasswordStrengthIndicator({ strength }) {
    if (!strength) return null;

    const colors = {
        weak: 'bg-red-500',
        medium: 'bg-yellow-500',
        strong: 'bg-green-500'
    };

    const widths = {
        weak: 'w-1/3',
        medium: 'w-2/3',
        strong: 'w-full'
    };

    return (
        <div className="mt-2">
            <div className="flex gap-1 h-1">
                <div className={`flex-1 rounded-full ${strength ? colors[strength] : 'bg-[#233554]'} ${widths[strength]}`}></div>
                <div className={`flex-1 rounded-full ${strength === 'medium' || strength === 'strong' ? colors[strength] : 'bg-[#233554]'}`}></div>
                <div className={`flex-1 rounded-full ${strength === 'strong' ? colors[strength] : 'bg-[#233554]'}`}></div>
            </div>
            <div className="text-xs mt-1 text-[#B6C6DA] capitalize">
                Password strength: {strength}
            </div>
        </div>
    );
}
