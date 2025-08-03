import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            Fitness Tracker
          </Link>
          <div className="space-x-4">
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
              Data Visualization
            </Link>
            <Link 
              to="/social" 
              className="hover:bg-blue-700 px-3 py-2 rounded transition duration-200"
            >
              Social Feed
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
