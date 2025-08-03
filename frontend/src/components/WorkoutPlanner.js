import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';

function WorkoutPlanner() {
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [date, setDate] = useState(new Date());
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch exercises on mount
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to access workout planner');
          return;
        }

        const response = await axios.get('/api/exercises/get', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExercises(response.data.exercises);
      } catch (err) {
        console.error('Fetch exercises error:', err.message);
        setError('Failed to load exercises');
      }
    };

    fetchExercises();
  }, []);

  // Handle exercise selection
  const handleExerciseToggle = (exerciseId) => {
    setSelectedExercises((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  // Handle form submission to create workout
  const handleCreateWorkout = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to create a workout');
        return;
      }

      if (!title || selectedExercises.length === 0) {
        setError('Title and at least one exercise are required');
        return;
      }

      const workoutData = {
        title,
        description,
        exercises: selectedExercises,
        duration: parseInt(duration) || 0,
        caloriesBurned: parseInt(caloriesBurned) || 0,
        date: format(date, 'yyyy-MM-dd'),
      };

      const response = await axios.post('/api/workouts/create', workoutData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess('Workout created successfully');
      setTitle('');
      setDescription('');
      setDuration('');
      setCaloriesBurned('');
      setSelectedExercises([]);
      setDate(new Date());
    } catch (err) {
      console.error('Create workout error:', err.message);
      setError('Failed to create workout');
    }
  };

  // Placeholder for edit and delete (to be implemented with workout ID)
  const handleEditWorkout = () => {
    setError('Edit functionality to be implemented');
  };

  const handleDeleteWorkout = () => {
    setError('Delete functionality to be implemented');
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-blue-600 mb-6">Workout Planner</h2>

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
        {/* Workout Form */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Create Workout</h3>
          <form onSubmit={handleCreateWorkout}>
            <div className="mb-4">
              <label className="block text-gray-700">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter workout title"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter workout description"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Duration (minutes)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter duration"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Calories Burned</label>
              <input
                type="number"
                value={caloriesBurned}
                onChange={(e) => setCaloriesBurned(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter calories burned"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Select Exercises</label>
              <div className="max-h-40 overflow-y-auto border rounded p-2">
                {exercises.length === 0 ? (
                  <p className="text-gray-500">No exercises available</p>
                ) : (
                  exercises.map((exercise) => (
                    <div key={exercise._id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={selectedExercises.includes(exercise._id)}
                        onChange={() => handleExerciseToggle(exercise._id)}
                        className="mr-2"
                      />
                      <span>{exercise.name} ({exercise.difficulty})</span>
                    </div>
                  ))
                )}
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Create Workout
            </button>
            <button
              type="button"
              onClick={handleEditWorkout}
              className="ml-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
            >
              Edit Workout
            </button>
            <button
              type="button"
              onClick={handleDeleteWorkout}
              className="ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Delete Workout
            </button>
          </form>
        </div>

        {/* Calendar */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Schedule Workout</h3>
          <Calendar
            onChange={setDate}
            value={date}
            className="border rounded w-full"
          />
          <p className="mt-4 text-gray-700">
            Selected Date: {format(date, 'MMMM d, yyyy')}
          </p>
        </div>
      </div>
    </div>
  );
}

export default WorkoutPlanner;
