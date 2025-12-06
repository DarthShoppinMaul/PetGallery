// HomeComp.jsx
// Consolidated components for the Home page landing experience
// Contains hero banner, statistics, featured pets grid, process steps, and call-to-action

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../services/api.js';

// Hero banner displayed at the top of the home page
// Shows main headline, tagline, and navigation buttons
// Conditionally renders sign-up button based on authentication state
export function HeroSection({ user }) {
    const navigate = useNavigate();

    return (
        <section className="relative overflow-hidden py-20 mb-12">
            {/* Gradient overlay for visual depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#64FFDA]/10 to-transparent"></div>
            <div className="relative text-center max-w-4xl mx-auto px-6">
                <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                    Find Your Perfect
                    <span className="text-[#64FFDA]"> Companion</span>
                </h1>
                <p className="text-xl text-[#B6C6DA] mb-8 leading-relaxed">
                    Give a loving home to a pet in need. Browse our adoptable pets and start your journey to finding a new best friend.
                </p>
                {/* Action buttons change based on user auth state */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={() => navigate('/pets')} className="btn text-lg px-8 py-3">
                        Browse Pets
                    </button>
                    {!user && (
                        <button onClick={() => navigate('/register')} className="btn-secondary text-lg px-8 py-3">
                            Get Started
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}

// Statistics section displaying platform metrics
// Shows total pets available, partner locations count, and completed adoptions
export function StatsSection({ stats }) {
    return (
        <section className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total pets stat card */}
                <div className="panel text-center py-8">
                    <div className="text-4xl font-bold text-[#64FFDA] mb-2">{stats.totalPets}+</div>
                    <div className="text-[#B6C6DA]">Pets Available</div>
                </div>
                {/* Locations stat card */}
                <div className="panel text-center py-8">
                    <div className="text-4xl font-bold text-[#64FFDA] mb-2">{stats.locations}</div>
                    <div className="text-[#B6C6DA]">Partner Locations</div>
                </div>
                {/* Adoptions stat card */}
                <div className="panel text-center py-8">
                    <div className="text-4xl font-bold text-[#64FFDA] mb-2">{stats.happyAdoptions}+</div>
                    <div className="text-[#B6C6DA]">Happy Adoptions</div>
                </div>
            </div>
        </section>
    );
}

// Featured pets grid showcasing available pets
// Displays up to 4 pet cards with photos and basic info
// Handles loading state and empty state messaging
export function FeaturedPets({ pets, loading }) {
    const navigate = useNavigate();

    return (
        <section className="mb-16">
            {/* Section header with view all link */}
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

            {/* Conditional rendering based on loading and data state */}
            {loading ? (
                <div className="text-center py-12 text-[#B6C6DA]">Loading pets...</div>
            ) : pets.length === 0 ? (
                <div className="text-center py-12 text-[#B6C6DA]">No pets available yet.</div>
            ) : (
                /* Pet cards grid layout */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {pets.map(pet => (
                        <div
                            key={pet.pet_id}
                            className="card cursor-pointer hover:border-[#64FFDA] transition-all"
                            onClick={() => navigate(`/pet/${pet.pet_id}`)}
                        >
                            {/* Pet photo with background image */}
                            <div
                                className="card-img"
                                style={{
                                    backgroundImage: pet.photo_url
                                        ? `url(${API_BASE_URL}/${pet.photo_url})`
                                        : undefined
                                }}
                            />
                            {/* Pet details and action button */}
                            <div className="card-body">
                                <div className="font-semibold text-lg mb-1">{pet.name}</div>
                                <div className="meta mb-3">
                                    {pet.species} - {pet.age} {pet.age === 1 ? 'yr' : 'yrs'}
                                </div>
                                <button className="btn text-sm w-full">Learn More</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

// Three-step process explanation section
// Displays Browse, Apply, and Adopt steps with icons
// Helps users understand the adoption workflow
export function HowItWorks() {
    // Step configuration with SVG icons, titles, and descriptions
    const steps = [
        {
            icon: (
                <svg className="w-8 h-8 text-[#64FFDA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            ),
            title: 'Browse Pets',
            description: 'Search through our database of adorable pets waiting for their forever homes.'
        },
        {
            icon: (
                <svg className="w-8 h-8 text-[#64FFDA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            title: 'Submit Application',
            description: 'Found your match? Fill out a simple adoption application to get started.'
        },
        {
            icon: (
                <svg className="w-8 h-8 text-[#64FFDA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            ),
            title: 'Take Them Home',
            description: 'After approval, complete the adoption process and welcome your new family member!'
        }
    ];

    return (
        <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            {/* Steps grid with icons and descriptions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {steps.map((step, index) => (
                    <div key={index} className="text-center">
                        {/* Circular icon container */}
                        <div className="w-16 h-16 bg-[#64FFDA]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            {step.icon}
                        </div>
                        <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                        <p className="text-[#B6C6DA]">{step.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

// Call-to-action section at the bottom of home page
// Encourages users to browse pets or sign up
// Button text changes based on authentication state
export function CallToAction({ user }) {
    const navigate = useNavigate();

    return (
        <section className="panel text-center py-12 bg-gradient-to-r from-[#112240] to-[#1a3a52]">
            <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
            <p className="text-lg text-[#B6C6DA] mb-8 max-w-2xl mx-auto">
                Every pet deserves a loving home. Start your adoption journey today and change a life forever.
            </p>
            {/* Dynamic button based on login state */}
            <button
                onClick={() => navigate(user ? '/pets' : '/register')}
                className="btn text-lg px-8 py-3"
            >
                {user ? 'Browse Pets Now' : 'Sign Up to Get Started'}
            </button>
        </section>
    );
}
