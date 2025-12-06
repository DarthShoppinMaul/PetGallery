// Divider.jsx
// Horizontal divider with optional text label

import React from 'react';

export default function Divider({ text }) {
    return (
        <div className="flex items-center my-6">
            <div className="flex-1 border-t border-[#1b355e]"></div>
            {text && (
                <span className="px-4 text-sm text-[#B6C6DA]">{text}</span>
            )}
            <div className="flex-1 border-t border-[#1b355e]"></div>
        </div>
    );
}