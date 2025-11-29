// Home.jsx
// Landing page with featured pets and adoption info

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { usePets } from '../hooks/petHooks.js';
import HeroSection from '../components/HeroSection.jsx';
import StatsSection from '../components/StatsSection.jsx';
import FeaturedPets from '../components/FeaturedPets.jsx';
import HowItWorks from '../components/HowItWorks.jsx';
import CallToAction from '../components/CallToAction.jsx';

export default function Home() {
    const { user } = useAuth();
    const { pets, loading } = usePets();
    const [stats, setStats] = useState({ totalPets: 0, locations: 3, happyAdoptions: 150 });

    const approvedPets = pets.filter(p => p.status === 'approved');
    const featuredPets = approvedPets.slice(0, 4);

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
