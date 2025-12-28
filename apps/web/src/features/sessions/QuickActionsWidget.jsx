import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';

export default function QuickActionsWidget({ planId }) {
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSubstitute, setShowSubstitute] = useState(false);
  const [alternatives, setAlternatives] = useState([]);

  // Navigate to evaluation form
  const handleEvaluate = () => {
    if (assignment?.sessionId) {
      navigate(`/session/${assignment.sessionId}/evaluate`);
    }
  };

  useEffect(() => {
    if (planId) loadToday();
  }, [planId]);

  const loadToday = async () => {
    try {
      const { data } = await apiClient.get(
        `/training-plan/${planId}/today`
      );
      if (data.data.hasAssignment) {
        setAssignment(data.data.assignment);
      }
    } catch (err) {
      console.error('Failed to load today:', err);
    }
  };

  const handleQuickAction = async (action) => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      await apiClient.put(
        `/training-plan/${planId}/daily/${today}/quick-action`,
        { action }
      );
      loadToday();
    } catch (err) {
      alert('Action failed: ' + (err.response?.data?.error?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const loadSubstitutes = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await apiClient.post(
        `/training-plan/${planId}/daily/${today}/substitute`,
        {}
      );
      setAlternatives(data.data.alternatives);
      setShowSubstitute(true);
    } catch (err) {
      alert('Cannot substitute: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  if (!assignment) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-2">Today's Training</h3>
        <p className="text-gray-600 mb-4">No session scheduled for today</p>
        <button
          onClick={() => navigate('/session/new')}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          + Opprett treningsokt
        </button>
      </div>
    );
  }

  if (assignment.isRestDay) {
    return (
      <div className="bg-blue-50 rounded-lg shadow p-6 border-2 border-blue-200">
        <h3 className="text-xl font-bold mb-2">Rest Day 😴</h3>
        <p className="text-gray-700">Recovery is important! Enjoy your rest day.</p>
      </div>
    );
  }

  const statusColors = {
    planned: 'bg-gray-100 text-gray-700',
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    skipped: 'bg-orange-100 text-orange-700',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold">Today's Training</h3>
          <span className={`inline-block px-2 py-1 rounded text-sm font-medium mt-1 ${statusColors[assignment.status]}`}>
            {assignment.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        <span className="text-sm text-gray-500">{assignment.period} Period</span>
      </div>

      <div className="mb-4">
        <h4 className="font-bold text-lg text-gray-900">{assignment.type}</h4>
        <p className="text-gray-600 text-sm">Duration: {assignment.duration} minutes</p>
        {assignment.sessionTemplate?.description && (
          <p className="text-gray-600 text-sm mt-2">{assignment.sessionTemplate.description}</p>
        )}
        {assignment.notes && (
          <div className="mt-2 p-2 bg-yellow-50 rounded text-sm">
            <strong>Coach notes:</strong> {assignment.notes}
          </div>
        )}
      </div>

      {showSubstitute ? (
        <div className="border-t pt-4">
          <h4 className="font-bold mb-3">Alternative Sessions:</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {alternatives.map(alt => (
              <div key={alt.id} className="p-3 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                <div className="font-medium">{alt.name}</div>
                <div className="text-sm text-gray-600">
                  {alt.duration} min • {alt.period} • {alt.learningPhase}
                </div>
                {alt.description && <div className="text-sm text-gray-500 mt-1">{alt.description}</div>}
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowSubstitute(false)}
            className="mt-3 text-sm text-blue-600 hover:text-blue-700"
          >
            ← Back
          </button>
        </div>
      ) : (
        <div className="flex gap-2 flex-wrap">
          {assignment.status === 'planned' && (
            <>
              <button
                onClick={() => handleQuickAction('start')}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
              >
                ▶️ Start
              </button>
              <button
                onClick={() => handleQuickAction('complete')}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
              >
                ✅ Complete
              </button>
            </>
          )}
          {assignment.status === 'in_progress' && (
            <>
              <button
                onClick={handleEvaluate}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
              >
                📝 Evaluer
              </button>
              <button
                onClick={() => handleQuickAction('complete')}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
              >
                ✅ Complete
              </button>
            </>
          )}
          {assignment.status === 'planned' && (
            <button
              onClick={() => handleQuickAction('skip')}
              disabled={loading}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
            >
              Skip
            </button>
          )}
          {assignment.canBeSubstituted && assignment.status === 'planned' && (
            <button
              onClick={loadSubstitutes}
              disabled={loading}
              className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 font-medium disabled:opacity-50"
            >
              🔄 Substitute
            </button>
          )}
        </div>
      )}
    </div>
  );
}
