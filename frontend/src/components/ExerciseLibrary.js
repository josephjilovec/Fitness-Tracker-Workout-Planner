/**
 * @fileoverview Exercise Library Component
 * @description Browse and search exercises with filters
 * @module components/ExerciseLibrary
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { apiService } from '../services/api';
import useApi from '../hooks/useApi';
import LoadingSpinner from './LoadingSpinner';

/**
 * ExerciseLibrary component
 * Optimized with debouncing and memoization
 */
const ExerciseLibrary = () => {
  const [filters, setFilters] = useState({
    muscleGroup: '',
    equipment: '',
    difficulty: '',
    search: '',
  });

  const muscleGroups = ['Chest', 'Back', 'Arms', 'Shoulders', 'Legs', 'Core', 'Full Body'];
  const equipmentOptions = [
    'None',
    'Dumbbells',
    'Barbell',
    'Kettlebell',
    'Resistance Band',
    'Machine',
    'Bodyweight',
  ];
  const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced'];

  // Fetch exercises with filters
  const {
    data: exercisesData,
    loading,
    error,
    execute: fetchExercises,
  } = useApi(apiService.getExercises, { showErrorToast: true });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchExercises(filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters, fetchExercises]);

  // Memoize exercises
  const exercises = useMemo(() => {
    return exercisesData?.exercises || [];
  }, [exercisesData]);

  // Handle filter change
  const handleFilterChange = useCallback((name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-blue-600 mb-6">Exercise Library</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Filter Exercises</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Search exercises..."
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Muscle Group</label>
            <select
              value={filters.muscleGroup}
              onChange={(e) => handleFilterChange('muscleGroup', e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">All</option>
              {muscleGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Equipment</label>
            <select
              value={filters.equipment}
              onChange={(e) => handleFilterChange('equipment', e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">All</option>
              {equipmentOptions.map((equip) => (
                <option key={equip} value={equip}>
                  {equip}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Difficulty</label>
            <select
              value={filters.difficulty}
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">All</option>
              {difficultyLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Exercise List */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">
          Exercises {exercises.length > 0 && `(${exercises.length})`}
        </h3>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : exercises.length === 0 ? (
          <p className="text-gray-500">No exercises found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exercises.map((exercise) => (
              <div
                key={exercise._id || exercise.id}
                className="border rounded-lg p-4 hover:shadow-lg transition"
              >
                <h4 className="text-lg font-medium mb-2">{exercise.name}</h4>
                <p className="text-gray-600 text-sm mb-2">
                  {exercise.description || 'No description available'}
                </p>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-600">
                    <strong>Muscle Group:</strong> {exercise.muscleGroup?.join(', ') || 'N/A'}
                  </p>
                  <p className="text-gray-600">
                    <strong>Equipment:</strong> {exercise.equipment?.join(', ') || 'None'}
                  </p>
                  <p className="text-gray-600">
                    <strong>Difficulty:</strong>{' '}
                    <span
                      className={`font-semibold ${
                        exercise.difficulty === 'Beginner'
                          ? 'text-green-600'
                          : exercise.difficulty === 'Intermediate'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {exercise.difficulty}
                    </span>
                  </p>
                </div>
                {exercise.media?.imageUrl && (
                  <img
                    src={exercise.media.imageUrl}
                    alt={exercise.name}
                    className="w-full h-32 object-cover rounded mt-2"
                    loading="lazy"
                  />
                )}
                {exercise.media?.videoUrl && (
                  <a
                    href={exercise.media.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-blue-600 hover:underline text-sm"
                  >
                    Watch Video →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseLibrary;
