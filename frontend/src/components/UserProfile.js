/**
 * @fileoverview User Profile Component
 * @description User profile management and achievements
 * @module components/UserProfile
 */

import React, { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * UserProfile component
 * Optimized with useCallback
 */
const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.profile?.name || '',
    age: user?.profile?.age || '',
    fitnessGoals: user?.profile?.fitnessGoals || [],
  });
  const [newGoal, setNewGoal] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle profile update
  const handleUpdateProfile = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        // Update local state
        updateUser({
          profile: {
            ...profile,
            age: profile.age ? parseInt(profile.age, 10) : null,
          },
        });

        // In a real app, you'd call an API here
        // await apiService.updateProfile(profile);
      } catch (error) {
        console.error('Update profile error:', error);
      } finally {
        setLoading(false);
      }
    },
    [profile, updateUser],
  );

  // Handle adding a new fitness goal
  const handleAddGoal = useCallback(() => {
    if (newGoal.trim() && !profile.fitnessGoals.includes(newGoal.trim())) {
      setProfile((prev) => ({
        ...prev,
        fitnessGoals: [...prev.fitnessGoals, newGoal.trim()],
      }));
      setNewGoal('');
    }
  }, [newGoal, profile.fitnessGoals]);

  // Handle removing a fitness goal
  const handleRemoveGoal = useCallback(
    (index) => {
      setProfile((prev) => ({
        ...prev,
        fitnessGoals: prev.fitnessGoals.filter((_, i) => i !== index),
      }));
    },
    [],
  );

  // Handle input change
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-blue-600 mb-6">User Profile</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Form */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>
          <form onSubmit={handleUpdateProfile}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter your name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Age</label>
              <input
                type="number"
                name="age"
                value={profile.age}
                onChange={handleChange}
                min="0"
                max="150"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter your age"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Fitness Goals</label>
              <div className="flex items-center mb-2">
                <input
                  type="text"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddGoal();
                    }
                  }}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Add a new goal"
                />
                <button
                  type="button"
                  onClick={handleAddGoal}
                  className="ml-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Add
                </button>
              </div>
              <ul className="list-disc pl-5 space-y-1">
                {profile.fitnessGoals.map((goal, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{goal}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveGoal(index)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <LoadingSpinner size="sm" className="mr-2" />
                  Updating...
                </span>
              ) : (
                'Update Profile'
              )}
            </button>
          </form>
        </div>

        {/* Achievements Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Achievements</h3>
          {user?.achievements?.length === 0 ? (
            <p className="text-gray-500">No achievements earned yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user?.achievements?.map((achievement, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:shadow-lg transition"
                >
                  <h4 className="text-lg font-medium">{achievement.badgeName}</h4>
                  <p className="text-gray-600 text-sm">
                    Earned: {new Date(achievement.dateEarned).toLocaleDateString()}
                  </p>
                  {achievement.description && (
                    <p className="text-gray-500 text-sm mt-1">{achievement.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
