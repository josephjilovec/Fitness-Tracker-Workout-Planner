import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserProfile() {
  const [profile, setProfile] = useState({ name: '', age: '', fitnessGoals: [] });
  const [achievements, setAchievements] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view your profile');
          return;
        }

        const response = await axios.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile({
          name: response.data.user.name || '',
          age: response.data.user.age || '',
          fitnessGoals: response.data.user.fitnessGoals || []
        });
        setAchievements(response.data.user.achievements || []);
        setError('');
      } catch (err) {
        console.error('Fetch profile error:', err.message);
        setError('Failed to load profile data');
      }
    };

    fetchProfile();
  }, []);

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to update your profile');
        return;
      }

      const profileData = {
        name: profile.name,
        age: parseInt(profile.age) || null,
        fitnessGoals: profile.fitnessGoals
      };

      const response = await axios.put('/api/users/profile', profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfile({
        name: response.data.user.name,
        age: response.data.user.age,
        fitnessGoals: response.data.user.fitnessGoals
      });
      setAchievements(response.data.user.achievements);
      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Update profile error:', err.message);
      setError('Failed to update profile');
    }
  };

  // Handle adding a new fitness goal
  const handleAddGoal = () => {
    if (newGoal.trim()) {
      setProfile((prev) => ({
        ...prev,
        fitnessGoals: [...prev.fitnessGoals, newGoal.trim()]
      }));
      setNewGoal('');
    }
  };

  // Handle removing a fitness goal
  const handleRemoveGoal = (index) => {
    setProfile((prev) => ({
      ...prev,
      fitnessGoals: prev.fitnessGoals.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-blue-600 mb-6">User Profile</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Form */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>
          <form onSubmit={handleUpdateProfile}>
            <div className="mb-4">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter your name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Age</label>
              <input
                type="number"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter your age"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Fitness Goals</label>
              <div className="flex items-center mb-2">
                <input
                  type="text"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
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
              <ul className="list-disc pl-5">
                {profile.fitnessGoals.map((goal, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{goal}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveGoal(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Update Profile
            </button>
          </form>
        </div>

        {/* Achievements Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Achievements</h3>
          {achievements.length === 0 ? (
            <p className="text-gray-500">No achievements earned yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-lg transition">
                  <h4 className="text-lg font-medium">{achievement.badgeName}</h4>
                  <p className="text-gray-600">
                    Earned: {new Date(achievement.dateEarned).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
