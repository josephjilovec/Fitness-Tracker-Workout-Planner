import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function DataVisualization() {
  const [stats, setStats] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch workout stats on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view workout statistics');
          setLoading(false);
          return;
        }

        const response = await axios.get('/api/workouts/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(response.data.stats);
        setError('');
        setLoading(false);
      } catch (err) {
        console.error('Fetch stats error:', err.message);
        setError('Failed to load workout statistics');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Prepare data for Chart.js
  const chartData = {
    labels: stats.map(stat => stat._id), // Date strings (YYYY-MM-DD)
    datasets: [
      {
        label: 'Total Duration (min)',
        data: stats.map(stat => stat.totalDuration),
        borderColor: '#1a73e8',
        backgroundColor: 'rgba(26, 115, 232, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Total Calories Burned',
        data: stats.map(stat => stat.totalCalories),
        borderColor: '#34d399',
        backgroundColor: 'rgba(52, 211, 153, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
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
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-blue-600 mb-6">Workout Statistics</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center text-gray-500">Loading statistics...</div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6">
          {stats.length === 0 ? (
            <p className="text-gray-500">No workout statistics available</p>
          ) : (
            <div className="card">
              <Line data={chartData} options={chartOptions} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DataVisualization;
