/**
 * @fileoverview Navigation Bar Component
 * @description Main navigation with authentication state
 * @module components/Navbar
 */

import React, { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Navbar component
 * Memoized for performance
 */
const Navbar = memo(() => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold hover:text-blue-200 transition">
            Fitness Tracker
          </Link>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className="hover:bg-blue-700 px-3 py-2 rounded transition duration-200"
                >
                  Dashboard
                </Link>
                <Link
                  to="/workout-planner"
                  className="hover:bg-blue-700 px-3 py-2 rounded transition duration-200"
                >
                  Workout Planner
                </Link>
                <Link
                  to="/exercise-library"
                  className="hover:bg-blue-700 px-3 py-2 rounded transition duration-200"
                >
                  Exercise Library
                </Link>
                <Link
                  to="/profile"
                  className="hover:bg-blue-700 px-3 py-2 rounded transition duration-200"
                >
                  Profile
                </Link>
                <Link
                  to="/data-visualization"
                  className="hover:bg-blue-700 px-3 py-2 rounded transition duration-200"
                >
                  Analytics
                </Link>
                <Link
                  to="/social"
                  className="hover:bg-blue-700 px-3 py-2 rounded transition duration-200"
                >
                  Social
                </Link>
                <div className="flex items-center space-x-2 border-l border-blue-500 pl-4">
                  <span className="text-sm">Welcome, {user?.username}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded transition duration-200"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:bg-blue-700 px-3 py-2 rounded transition duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-700 hover:bg-blue-800 px-3 py-2 rounded transition duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
