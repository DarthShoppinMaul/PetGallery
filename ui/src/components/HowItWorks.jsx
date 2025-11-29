// HowItWorks.jsx
// How the adoption process works section

import React from 'react';

export default function HowItWorks() {
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {steps.map((step, index) => (
                    <div key={index} className="text-center">
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
