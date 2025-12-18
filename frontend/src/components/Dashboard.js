/**
 * @fileoverview Dashboard Component
 * @description Main dashboard with workout history and profile summary
 * @module components/Dashboard
 */

import React, { useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import useApi from '../hooks/useApi';
import LoadingSpinner from './LoadingSpinner';

/**
 * Dashboard component
 * Optimized with useMemo and custom hooks
 */
const Dashboard = () => {
  const { user } = useAuth();
  const {
    data: workoutsData,
    loading: workoutsLoading,
    error: workoutsError,
    execute: fetchWorkouts,
  } = useApi(apiService.getWorkouts, { showErrorToast: true });

  useEffect(() => {
    fetchWorkouts({ limit: 10 });
  }, [fetchWorkouts]);

  // Memoize workouts to prevent unnecessary re-renders
  const workouts = useMemo(() => {
    return workoutsData?.workouts || [];
  }, [workoutsData]);

  // Memoize recent activities
  const recentActivities = useMemo(() => {
    return workouts.slice(0, 5);
  }, [workouts]);

  if (workoutsLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-blue-600 mb-6">
        Welcome back, {user?.username || 'User'}!
      </h2>

      {workoutsError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {workoutsError}
        </div>
      )}

      {/* Profile Summary */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Profile Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-600">Name</p>
            <p className="font-semibold">{user?.profile?.name || 'Not set'}</p>
          </div>
          <div>
            <p className="text-gray-600">Age</p>
            <p className="font-semibold">{user?.profile?.age || 'Not set'}</p>
          </div>
          <div>
            <p className="text-gray-600">Fitness Goals</p>
            <p className="font-semibold">
              {user?.profile?.fitnessGoals?.length || 0} goal(s)
            </p>
          </div>
        </div>
      </div>

      {/* Workout History */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Recent Workouts</h3>
        {workouts.length === 0 ? (
          <p className="text-gray-500">No workouts recorded yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workouts.map((workout) => (
              <div
                key={workout._id || workout.id}
                className="border rounded-lg p-4 hover:shadow-lg transition"
              >
                <h4 className="text-lg font-medium">{workout.title}</h4>
                <p className="text-gray-600">
                  Date: {new Date(workout.date).toLocaleDateString()}
                </p>
                <p className="text-gray-600">Duration: {workout.duration} min</p>
                <p className="text-gray-600">Calories: {workout.caloriesBurned}</p>
                <p className="text-gray-600">
                  Exercises: {workout.exercises?.length || 0}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activities */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>
        {recentActivities.length === 0 ? (
          <p className="text-gray-500">No recent activities.</p>
        ) : (
          <ul className="list-disc pl-5">
            {recentActivities.map((workout) => (
              <li key={workout._id || workout.id} className="text-gray-700">
                Completed "{workout.title}" on{' '}
                {new Date(workout.date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
