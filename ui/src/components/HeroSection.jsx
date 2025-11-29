// HeroSection.jsx
// Hero banner for the home page

import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HeroSection({ user }) {
    const navigate = useNavigate();

    return (
        <section className="relative overflow-hidden py-20 mb-12">
            <div className="absolute inset-0 bg-gradient-to-br from-[#64FFDA]/10 to-transparent"></div>
            <div className="relative text-center max-w-4xl mx-auto px-6">
                <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                    Find Your Perfect
                    <span className="text-[#64FFDA]"> Companion</span>
                </h1>
                <p className="text-xl text-[#B6C6DA] mb-8 leading-relaxed">
                    Give a loving home to a pet in need. Browse our adoptable pets and start your journey to finding a new best friend.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate('/pets')}
                        className="btn text-lg px-8 py-3"
                    >
                        Browse Pets
                    </button>
                    {!user && (
                        <button
                            onClick={() => navigate('/register')}
                            className="btn-secondary text-lg px-8 py-3"
                        >
                            Get Started
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}
