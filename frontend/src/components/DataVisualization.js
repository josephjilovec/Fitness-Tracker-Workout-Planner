/**
 * @fileoverview Data Visualization Component
 * @description Workout statistics visualization with Chart.js
 * @module components/DataVisualization
 */

import React, { useEffect, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { apiService } from '../services/api';
import useApi from '../hooks/useApi';
import LoadingSpinner from './LoadingSpinner';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

/**
 * DataVisualization component
 * Optimized with useMemo for chart data
 */
const DataVisualization = () => {
  const {
    data: statsData,
    loading,
    error,
    execute: fetchStats,
  } = useApi(apiService.getWorkoutStats, { showErrorToast: true });

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Memoize chart data
  const chartData = useMemo(() => {
    const stats = statsData?.dailyStats || [];
    return {
      labels: stats.map((stat) => stat._id),
      datasets: [
        {
          label: 'Total Duration (min)',
          data: stats.map((stat) => stat.totalDuration),
          borderColor: '#1a73e8',
          backgroundColor: 'rgba(26, 115, 232, 0.2)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Total Calories Burned',
          data: stats.map((stat) => stat.totalCalories),
          borderColor: '#34d399',
          backgroundColor: 'rgba(52, 211, 153, 0.2)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }, [statsData]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Workout Statistics Over Time',
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Date',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Value',
          },
          beginAtZero: true,
        },
      },
    }),
    [],
  );

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-blue-600 mb-6">Workout Analytics</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6">
          {statsData?.dailyStats?.length === 0 ? (
            <p className="text-gray-500">No workout statistics available</p>
          ) : (
            <>
              {statsData?.totals && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-600">Total Workouts</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {statsData.totals.totalWorkouts}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-gray-600">Total Duration</p>
                    <p className="text-2xl font-bold text-green-600">
                      {statsData.totals.totalDuration} min
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-gray-600">Total Calories</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {statsData.totals.totalCalories}
                    </p>
                  </div>
                </div>
              )}
              <div style={{ height: '400px' }}>
                <Line data={chartData} options={chartOptions} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DataVisualization;
