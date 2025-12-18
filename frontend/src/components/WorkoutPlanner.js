/**
 * @fileoverview Workout Planner Component
 * @description Create and manage workouts with exercise selection
 * @module components/WorkoutPlanner
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import { apiService } from '../services/api';
import useApi from '../hooks/useApi';
import LoadingSpinner from './LoadingSpinner';

/**
 * WorkoutPlanner component
 * Optimized with useMemo and useCallback
 */
const WorkoutPlanner = () => {
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    caloriesBurned: '',
  });
  const [date, setDate] = useState(new Date());

  // Fetch exercises
  const {
    data: exercisesData,
    loading: exercisesLoading,
    execute: fetchExercises,
  } = useApi(apiService.getExercises, { showErrorToast: true });

  // Create workout
  const {
    loading: createLoading,
    execute: createWorkout,
    reset: resetCreate,
  } = useApi(apiService.createWorkout, { showSuccessToast: true, showErrorToast: true });

  useEffect(() => {
    fetchExercises({ limit: 100 });
  }, [fetchExercises]);

  // Memoize exercises list
  const exercises = useMemo(() => {
    return exercisesData?.exercises || [];
  }, [exercisesData]);

  // Handle exercise toggle
  const handleExerciseToggle = useCallback((exerciseId) => {
    setSelectedExercises((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId],
    );
  }, []);

  // Handle form change
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!formData.title || selectedExercises.length === 0) {
        return;
      }

      const workoutData = {
        title: formData.title,
        description: formData.description || '',
        exercises: selectedExercises,
        duration: parseInt(formData.duration, 10) || 0,
        caloriesBurned: parseInt(formData.caloriesBurned, 10) || 0,
        date: format(date, 'yyyy-MM-dd'),
      };

      const result = await createWorkout(workoutData);
      if (result.success) {
        // Reset form
        setFormData({
          title: '',
          description: '',
          duration: '',
          caloriesBurned: '',
        });
        setSelectedExercises([]);
        setDate(new Date());
        resetCreate();
      }
    },
    [formData, selectedExercises, date, createWorkout, resetCreate],
  );

  if (exercisesLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-blue-600 mb-6">Workout Planner</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workout Form */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Create Workout</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter workout title"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter workout description"
                rows="3"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Duration (minutes)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="0"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter duration"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Calories Burned</label>
              <input
                type="number"
                name="caloriesBurned"
                value={formData.caloriesBurned}
                onChange={handleChange}
                min="0"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter calories burned"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Select Exercises *</label>
              <div className="max-h-40 overflow-y-auto border rounded p-2">
                {exercises.length === 0 ? (
                  <p className="text-gray-500">No exercises available</p>
                ) : (
                  exercises.map((exercise) => (
                    <div key={exercise._id || exercise.id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={selectedExercises.includes(exercise._id || exercise.id)}
                        onChange={() => handleExerciseToggle(exercise._id || exercise.id)}
                        className="mr-2"
                      />
                      <span>
                        {exercise.name} ({exercise.difficulty})
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={createLoading || !formData.title || selectedExercises.length === 0}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createLoading ? (
                <span className="flex items-center justify-center">
                  <LoadingSpinner size="sm" className="mr-2" />
                  Creating...
                </span>
              ) : (
                'Create Workout'
              )}
            </button>
          </form>
        </div>

        {/* Calendar */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Schedule Workout</h3>
          <Calendar onChange={setDate} value={date} className="border rounded w-full" />
          <p className="mt-4 text-gray-700">
            Selected Date: {format(date, 'MMMM d, yyyy')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlanner;
