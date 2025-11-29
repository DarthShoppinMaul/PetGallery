// Divider.jsx
// Visual divider with text

import React from 'react';

export default function Divider({ text }) {
    return (
        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#1b355e]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#112240] text-[#B6C6DA]">{text}</span>
            </div>
        </div>
    );
}
