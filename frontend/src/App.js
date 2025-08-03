import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import WorkoutPlanner from './components/WorkoutPlanner';
import ExerciseLibrary from './components/ExerciseLibrary';
import UserProfile from './components/UserProfile';
import DataVisualization from './components/DataVisualization';
import SocialFeed from './components/SocialFeed';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/workout-planner" element={<WorkoutPlanner />} />
            <Route path="/exercise-library" element={<ExerciseLibrary />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/data-visualization" element={<DataVisualization />} />
            <Route path="/social" element={<SocialFeed />} />
            <Route path="*" element={<div className="text-center text-2xl text-red-500">404 - Page Not Found</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
