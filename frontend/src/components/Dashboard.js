import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [workouts, setWorkouts] = useState([]);
  const [profile, setProfile] = useState({ name: '', age: null, fitnessGoals: [] });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view your dashboard');
          return;
        }

        // Fetch user profile
        const profileResponse = await axios.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(profileResponse.data.user);

        // Fetch workout history
        const workoutsResponse = await axios.get('/api/workouts/get', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWorkouts(workoutsResponse.data.workouts);
      } catch (err) {
        console.error('Dashboard fetch error:', err.message);
        setError('Failed to load dashboard data');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-blue-600 mb-6">Welcome to Your Dashboard</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Profile Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Profile</h3>
        <p><strong>Name:</strong> {profile.name || 'Not set'}</p>
        <p><strong>Age:</strong> {profile.age || 'Not set'}</p>
        <p><strong>Fitness Goals:</strong> {profile.fitnessGoals.length > 0 ? profile.fitnessGoals.join(', ') : 'None'}</p>
      </div>

      {/* Workout History Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Workout History</h3>
        {workouts.length === 0 ? (
          <p className="text-gray-500">No workouts recorded yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workouts.map(workout => (
              <div key={workout._id} className="border rounded-lg p-4 hover:shadow-lg transition">
                <h4 className="text-lg font-medium">{workout.title}</h4>
                <p className="text-gray-600">Date: {new Date(workout.date).toLocaleDateString()}</p>
                <p className="text-gray-600">Duration: {workout.duration} min</p>
                <p className="text-gray-600">Calories: {workout.caloriesBurned}</p>
                <p className="text-gray-600">Exercises: {workout.exercises.length}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activities Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>
        {workouts.length === 0 ? (
          <p className="text-gray-500">No recent activities.</p>
        ) : (
          <ul className="list-disc pl-5">
            {workouts.slice(0, 5).map(workout => (
              <li key={workout._id} className="text-gray-700">
                Completed "{workout.title}" on {new Date(workout.date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
