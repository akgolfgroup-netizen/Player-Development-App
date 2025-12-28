import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';

export default function ProgressWidget({ planId }) {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (planId) loadAnalytics();
  }, [planId]);

  const loadAnalytics = async () => {
    try {
      const { data: response } = await apiClient.get(
        `/training-plan/${planId}/analytics`
      );
      setData(response.data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    }
  };

  if (!data) return null;

  const { overview } = data;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Your Progress</h3>
        <button
          onClick={() => navigate('/progress')}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View Details →
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-3xl font-bold text-blue-600">
            {overview.completionRate}%
          </div>
          <div className="text-sm text-gray-600 mt-1">Completion</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-3xl font-bold text-orange-600">
            {overview.currentStreak}
          </div>
          <div className="text-sm text-gray-600 mt-1">Day Streak 🔥</div>
        </div>
      </div>

      <div className="flex justify-between text-sm text-gray-600">
        <span>{overview.totalSessionsCompleted} sessions completed</span>
        <span>{overview.totalHoursCompleted}h trained</span>
      </div>
    </div>
  );
}
