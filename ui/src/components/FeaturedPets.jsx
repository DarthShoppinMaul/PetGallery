// FeaturedPets.jsx
// Featured pets grid for the home page

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../services/api.js';

export default function FeaturedPets({ pets, loading }) {
    const navigate = useNavigate();

    return (
        <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold">Featured Pets</h2>
                <button
                    onClick={() => navigate('/pets')}
                    className="text-[#64FFDA] hover:underline flex items-center gap-2"
                >
                    View All
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-[#B6C6DA]">Loading pets...</div>
            ) : pets.length === 0 ? (
                <div className="text-center py-12 text-[#B6C6DA]">No pets available yet.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {pets.map(pet => (
                        <div
                            key={pet.pet_id}
                            className="card cursor-pointer hover:border-[#64FFDA] transition-all"
                            onClick={() => navigate(`/pet/${pet.pet_id}`)}
                        >
                            <div
                                className="card-img"
                                style={{
                                    backgroundImage: pet.photo_url
                                        ? `url(${API_BASE_URL}/${pet.photo_url})`
                                        : undefined
                                }}
                            />
                            <div className="card-body">
                                <div className="font-semibold text-lg mb-1">{pet.name}</div>
                                <div className="meta mb-3">
                                    {pet.species} • {pet.age} {pet.age === 1 ? 'yr' : 'yrs'}
                                </div>
                                <button className="btn text-sm w-full">
                                    Learn More
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
