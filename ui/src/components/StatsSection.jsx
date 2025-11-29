// StatsSection.jsx
// Statistics display for the home page

import React from 'react';

export default function StatsSection({ stats }) {
    return (
        <section className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="panel text-center py-8">
                    <div className="text-4xl font-bold text-[#64FFDA] mb-2">{stats.totalPets}+</div>
                    <div className="text-[#B6C6DA]">Pets Available</div>
                </div>
                <div className="panel text-center py-8">
                    <div className="text-4xl font-bold text-[#64FFDA] mb-2">{stats.locations}</div>
                    <div className="text-[#B6C6DA]">Partner Locations</div>
                </div>
                <div className="panel text-center py-8">
                    <div className="text-4xl font-bold text-[#64FFDA] mb-2">{stats.happyAdoptions}+</div>
                    <div className="text-[#B6C6DA]">Happy Adoptions</div>
                </div>
            </div>
        </section>
    );
}
