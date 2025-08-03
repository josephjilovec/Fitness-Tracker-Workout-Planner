import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ExerciseLibrary() {
  const [exercises, setExercises] = useState([]);
  const [muscleGroup, setMuscleGroup] = useState('');
  const [equipment, setEquipment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Muscle groups and equipment options
  const muscleGroups = ['Chest', 'Back', 'Arms', 'Shoulders', 'Legs', 'Core', 'Full Body'];
  const equipmentOptions = ['None', 'Dumbbells', 'Barbell', 'Kettlebell', 'Resistance Band', 'Machine', 'Bodyweight'];

  // Fetch exercises on mount and when filters change
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to access the exercise library');
          return;
        }

        const params = {};
        if (muscleGroup) params.muscleGroup = muscleGroup;
        if (equipment) params.equipment = equipment;

        const response = await axios.get('/api/exercises/search', {
          headers: { Authorization: `Bearer ${token}` },
          params
        });
        setExercises(response.data.exercises);
        setError('');
      } catch (err) {
        console.error('Fetch exercises error:', err.message);
        setError('Failed to load exercises');
      }
    };

    fetchExercises();
  }, [muscleGroup, equipment]);

  // Handle adding exercise to a workout (placeholder)
  const handleAddToWorkout = async (exerciseId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to add exercises to a workout');
        return;
      }

      // Placeholder: Implement actual workout addition logic
      setSuccess(`Exercise ${exerciseId} added to workout (placeholder)`);
      setTimeout(() => setSuccess(''), 3000); // Clear success message
    } catch (err) {
      console.error('Add to workout error:', err.message);
      setError('Failed to add exercise to workout');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-blue-600 mb-6">Exercise Library</h2>

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

      {/* Filters */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Filter Exercises</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Muscle Group</label>
            <select
              value={muscleGroup}
              onChange={(e) => setMuscleGroup(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">All</option>
              {muscleGroups.map((group) => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Equipment</label>
            <select
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">All</option>
              {equipmentOptions.map((equip) => (
                <option key={equip} value={equip}>{equip}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Exercise List */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Exercises</h3>
        {exercises.length === 0 ? (
          <p className="text-gray-500">No exercises found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exercises.map((exercise) => (
              <div key={exercise._id} className="border rounded-lg p-4 hover:shadow-lg transition">
                <h4 className="text-lg font-medium">{exercise.name}</h4>
                <p className="text-gray-600"><strong>Description:</strong> {exercise.description || 'N/A'}</p>
                <p className="text-gray-600"><strong>Muscle Group:</strong> {exercise.muscleGroup.join(', ')}</p>
                <p className="text-gray-600"><strong>Equipment:</strong> {exercise.equipment.join(', ') || 'None'}</p>
                <p className="text-gray-600"><strong>Difficulty:</strong> {exercise.difficulty}</p>
                {exercise.media.imageUrl && (
                  <img
                    src={exercise.media.imageUrl}
                    alt={exercise.name}
                    className="w-full h-32 object-cover rounded mt-2"
                  />
                )}
                {exercise.media.videoUrl && (
                  <a
                    href={exercise.media.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Watch Video
                  </a>
                )}
                <button
                  onClick={() => handleAddToWorkout(exercise._id)}
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Add to Workout
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ExerciseLibrary;
