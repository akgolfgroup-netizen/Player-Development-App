import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import Button from '../../ui/primitives/Button';
import { SubSectionTitle, CardTitle } from '../../components/typography';

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
        <SubSectionTitle className="mb-2">Today's Training</SubSectionTitle>
        <p className="text-gray-600 mb-4">No session scheduled for today</p>
        <Button
          variant="primary"
          onClick={() => navigate('/session/new')}
          style={{ width: '100%' }}
        >
          + Opprett treningsokt
        </Button>
      </div>
    );
  }

  if (assignment.isRestDay) {
    return (
      <div className="bg-blue-50 rounded-lg shadow p-6 border-2 border-blue-200">
        <SubSectionTitle className="mb-2">Rest Day</SubSectionTitle>
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
          <SubSectionTitle>Today's Training</SubSectionTitle>
          <span className={`inline-block px-2 py-1 rounded text-sm font-medium mt-1 ${statusColors[assignment.status]}`}>
            {assignment.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        <span className="text-sm text-gray-500">{assignment.period} Period</span>
      </div>

      <div className="mb-4">
        <CardTitle>{assignment.type}</CardTitle>
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
          <CardTitle className="mb-3">Alternative Sessions:</CardTitle>
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSubstitute(false)}
            style={{ marginTop: '12px' }}
          >
            ← Back
          </Button>
        </div>
      ) : (
        <div className="flex gap-2 flex-wrap">
          {assignment.status === 'planned' && (
            <>
              <Button
                variant="primary"
                onClick={() => handleQuickAction('start')}
                disabled={loading}
                style={{ flex: 1 }}
              >
                ▶️ Start
              </Button>
              <Button
                variant="primary"
                onClick={() => handleQuickAction('complete')}
                disabled={loading}
                style={{ flex: 1, backgroundColor: 'var(--success)' }}
              >
                ✅ Complete
              </Button>
            </>
          )}
          {assignment.status === 'in_progress' && (
            <>
              <Button
                variant="primary"
                onClick={handleEvaluate}
                disabled={loading}
                style={{ flex: 1, backgroundColor: 'var(--success)' }}
              >
                📝 Evaluer
              </Button>
              <Button
                variant="primary"
                onClick={() => handleQuickAction('complete')}
                disabled={loading}
                style={{ flex: 1 }}
              >
                ✅ Complete
              </Button>
            </>
          )}
          {assignment.status === 'planned' && (
            <Button
              variant="secondary"
              onClick={() => handleQuickAction('skip')}
              disabled={loading}
            >
              Skip
            </Button>
          )}
          {assignment.canBeSubstituted && assignment.status === 'planned' && (
            <Button
              variant="secondary"
              onClick={loadSubstitutes}
              disabled={loading}
              style={{ backgroundColor: 'rgba(251, 146, 60, 0.2)', color: 'rgb(194, 65, 12)' }}
            >
              🔄 Substitute
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
