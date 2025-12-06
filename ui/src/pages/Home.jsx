// Home.jsx
// Landing page displaying hero section, statistics, featured pets, and adoption process
// Serves as the main entry point for users browsing the pet gallery

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { usePets } from '../hooks/petHooks.js';
import { HeroSection, StatsSection, FeaturedPets, HowItWorks, CallToAction } from '../components/HomeComp.jsx';

export default function Home() {
    const { user } = useAuth();
    const { pets, loading } = usePets();

    // Platform statistics displayed in stats section
    const [stats, setStats] = useState({ totalPets: 0, locations: 3, happyAdoptions: 150 });

    // Filter to show only approved pets on homepage
    const approvedPets = pets.filter(p => p.status === 'approved');
    const featuredPets = approvedPets.slice(0, 4);

    // Update pet count when data loads
    useEffect(() => {
        setStats(prev => ({ ...prev, totalPets: approvedPets.length }));
    }, [approvedPets.length]);

    return (
        <div>
            <HeroSection user={user} />
            <StatsSection stats={stats} />
            <FeaturedPets pets={featuredPets} loading={loading} />
            <HowItWorks />
            <CallToAction user={user} />
        </div>
    );
}