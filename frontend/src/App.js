/**
 * @fileoverview Main App Component
 * @description Root component with routing and context providers
 * @module App
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import WorkoutPlanner from './components/WorkoutPlanner';
import ExerciseLibrary from './components/ExerciseLibrary';
import UserProfile from './components/UserProfile';
import DataVisualization from './components/DataVisualization';
import SocialFeed from './components/SocialFeed';

/**
 * Main App component
 */
function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/workout-planner"
                  element={
                    <ProtectedRoute>
                      <WorkoutPlanner />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/exercise-library"
                  element={
                    <ProtectedRoute>
                      <ExerciseLibrary />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <UserProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/data-visualization"
                  element={
                    <ProtectedRoute>
                      <DataVisualization />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/social"
                  element={
                    <ProtectedRoute>
                      <SocialFeed />
                    </ProtectedRoute>
                  }
                />

                {/* 404 */}
                <Route
                  path="*"
                  element={
                    <div className="text-center text-2xl text-red-500">
                      404 - Page Not Found
                    </div>
                  }
                />
              </Routes>
            </main>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
