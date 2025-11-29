// CallToAction.jsx
// Call to action section for the home page

import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CallToAction({ user }) {
    const navigate = useNavigate();

    return (
        <section className="panel text-center py-12 bg-gradient-to-r from-[#112240] to-[#1a3a52]">
            <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
            <p className="text-lg text-[#B6C6DA] mb-8 max-w-2xl mx-auto">
                Every pet deserves a loving home. Start your adoption journey today and change a life forever.
            </p>
            <button
                onClick={() => navigate(user ? '/pets' : '/register')}
                className="btn text-lg px-8 py-3"
            >
                {user ? 'Browse Pets Now' : 'Sign Up to Get Started'}
            </button>
        </section>
    );
}
