// main.jsx
// Application entry point with route configuration

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Page imports
import App from './App.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Registration from './pages/Registration.jsx';
import PetList from './pages/PetList.jsx';
import PetDetails from './pages/PetDetails.jsx';
import AdoptionApplicationForm from './pages/AdoptionApplicationForm.jsx';
import MyApplications from './pages/MyApplications.jsx';
import ApplicationReview from './pages/ApplicationReview.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import UserManagement from './pages/UserManagement.jsx';
import UserProfile from './pages/UserProfile.jsx';
import ManagePet from './pages/ManagePet.jsx';
import ManageLocation from './pages/ManageLocation.jsx';

// Route configuration
const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            // Public routes
            { index: true, element: <Home /> },
            { path: 'login', element: <Login /> },
            { path: 'register', element: <Registration /> },
            { path: 'pets', element: <PetList /> },
            { path: 'pet/:id', element: <PetDetails /> },

            // Protected user routes
            {
                path: 'apply/:petId',
                element: <ProtectedRoute><AdoptionApplicationForm /></ProtectedRoute>,
            },
            {
                path: 'my-applications',
                element: <ProtectedRoute><MyApplications /></ProtectedRoute>,
            },
            {
                path: 'profile',
                element: <ProtectedRoute><UserProfile /></ProtectedRoute>,
            },

            // Protected admin routes
            {
                path: 'admin/dashboard',
                element: <ProtectedRoute><AdminDashboard /></ProtectedRoute>,
            },
            {
                path: 'admin/application/:id',
                element: <ProtectedRoute><ApplicationReview /></ProtectedRoute>,
            },
            {
                path: 'admin/users',
                element: <ProtectedRoute><UserManagement /></ProtectedRoute>,
            },
            {
                path: 'add-pet',
                element: <ProtectedRoute><ManagePet /></ProtectedRoute>,
            },
            {
                path: 'add-location',
                element: <ProtectedRoute><ManageLocation /></ProtectedRoute>,
            },
            {
                path: 'admin/manage-pets',
                element: <ProtectedRoute><ManagePet /></ProtectedRoute>,
            },
        ],
    },
]);

// Render application
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </React.StrictMode>
);