// ImageFileInput.jsx
// File input component for image uploads with validation

import React from 'react';
import { API_BASE_URL } from '../services/api.js';

const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

export default function ImageFileInput({ 
    id,
    label,
    currentImageUrl,
    selectedFile,
    onChange,
    error,
    showCurrentImage = false
}) {
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) {
            onChange(null, null);
            return;
        }

        let validationError = null;
        if (file.size > MAX_FILE_SIZE_BYTES) {
            validationError = `File size must be less than ${MAX_FILE_SIZE_MB}MB`;
        } else if (!ALLOWED_TYPES.includes(file.type)) {
            validationError = 'File must be an image (JPEG, PNG, GIF, or WebP)';
        }

        onChange(file, validationError);
    };

    return (
        <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">
                {label} (Max {MAX_FILE_SIZE_MB}MB)
            </label>

            {showCurrentImage && currentImageUrl && (
                <div className="mb-2">
                    <img
                        src={`${API_BASE_URL}/${currentImageUrl}`}
                        alt="Current"
                        className="w-32 h-32 object-cover rounded border border-[#1b355e]"
                    />
                    <p className="text-sm text-[#B6C6DA] mt-1">Current photo</p>
                </div>
            )}

            <input
                type="file"
                id={id}
                className={`input ${error ? 'border-red-500' : ''}`}
                accept={ALLOWED_TYPES.join(',')}
                onChange={handleFileChange}
                data-cy={`${id}-input`}
            />

            {error && (
                <div className="text-red-400 text-sm mt-1" data-cy={`${id}-error`}>
                    {error}
                </div>
            )}

            {selectedFile && !error && (
                <div className="text-sm text-[#B6C6DA] mt-1">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)}MB)
                </div>
            )}
        </div>
    );
}
