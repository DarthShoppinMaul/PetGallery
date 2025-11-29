// App.jsx
// Main layout component with navigation bar

import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

export default function App() {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async (e) => {
        e.preventDefault();
        await logout();
        navigate('/');
    };

    return (
        <>
            <nav className="navbar">
                <div className="nav-left">Pet Gallery</div>

                <div className="nav-right">
                    <NavLink
                        to="/"
                        className={({ isActive }) => isActive ? 'nav-active' : ''}
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/pets"
                        className={({ isActive }) => isActive ? 'nav-active' : ''}
                    >
                        Browse Pets
                    </NavLink>

                    {isAuthenticated && (
                        <>
                            {!user?.is_admin && (
                                <NavLink
                                    to="/my-applications"
                                    className={({ isActive }) => isActive ? 'nav-active' : ''}
                                >
                                    My Applications
                                </NavLink>
                            )}

                            <NavLink
                                to="/profile"
                                className={({ isActive }) => isActive ? 'nav-active' : ''}
                                data-cy="profile-link"
                            >
                                Profile
                            </NavLink>

                            {user?.is_admin && (
                                <>
                                    <NavLink
                                        to="/admin/dashboard"
                                        className={({ isActive }) => isActive ? 'nav-active' : ''}
                                    >
                                        Dashboard
                                    </NavLink>
                                    <NavLink
                                        to="/admin/users"
                                        className={({ isActive }) => isActive ? 'nav-active' : ''}
                                        data-cy="user-management-link"
                                    >
                                        Manage Users
                                    </NavLink>
                                    <NavLink
                                        to="/add-pet"
                                        className={({ isActive }) => isActive ? 'nav-active' : ''}
                                    >
                                        Manage Pet
                                    </NavLink>
                                    <NavLink
                                        to="/add-location"
                                        className={({ isActive }) => isActive ? 'nav-active' : ''}
                                    >
                                        Manage Location
                                    </NavLink>
                                </>
                            )}
                        </>
                    )}

                    {!isAuthenticated && (
                        <>
                            <NavLink
                                to="/login"
                                className={({ isActive }) => isActive ? 'nav-active' : ''}
                            >
                                Login
                            </NavLink>
                            <NavLink
                                to="/register"
                                className={({ isActive }) => isActive ? 'nav-active' : ''}
                            >
                                Sign Up
                            </NavLink>
                        </>
                    )}

                    {isAuthenticated && (
                        <a href="/" onClick={handleLogout} data-cy="logout-link">
                            Logout
                        </a>
                    )}
                </div>
            </nav>

            <main className="container-narrow">
                <Outlet />
            </main>

            <div id="toast" className="toast" />
        </>
    );
}
