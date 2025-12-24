import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

/**
 * Plan Preview Component
 * Implements UI contract for plan-generation.contract.ts
 *
 * States: loading → viewing → accepting → accepted
 *         loading → error_not_found
 *         loading → error_system
 *         viewing → requesting_modifications → modification_requested
 *         viewing → rejecting → rejected
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api/v1';

export default function PlanPreview() {
  const { planId } = useParams();
  const navigate = useNavigate();

  // State Machine states
  const [state, setState] = useState('loading');
  const [viewMode, setViewMode] = useState('overview');

  // Data
  const [planData, setPlanData] = useState(null);
  const [error, setError] = useState(null);

  // Modal states
  const [showModificationModal, setShowModificationModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [modificationForm, setModificationForm] = useState({
    concerns: [],
    notes: '',
    urgency: 'medium'
  });
  const [rejectForm, setRejectForm] = useState({
    reason: '',
    willCreateNewIntake: false
  });

  // Load plan on mount
  useEffect(() => {
    loadPlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId]);

  // Auto-navigation after accept
  useEffect(() => {
    if (state === 'accepted') {
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state, navigate]);

  // Auto-navigation after modification requested
  useEffect(() => {
    if (state === 'modification_requested') {
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state, navigate]);

  // Load complete plan
  const loadPlan = async () => {
    setState('loading');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/training-plan/${planId}/full?includeSessionDetails=true`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setPlanData(response.data.data);
        setState('viewing');
      }
    } catch (err) {
      if (err.response?.status === 404 || err.response?.status === 403) {
        setError({
          code: err.response.data.error?.code || 'PLAN_NOT_FOUND',
          message: err.response.data.error?.message || 'Training plan not found'
        });
        setState('error_not_found');
      } else {
        setError({
          code: 'SYSTEM_ERROR',
          message: 'Failed to load training plan. Please try again.'
        });
        setState('error_system');
      }
    }
  };

  // Accept plan
  const handleAcceptPlan = async () => {
    setState('accepting');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_BASE_URL}/training-plan/${planId}/accept`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setState('accepted');
      }
    } catch (err) {
      if (err.response?.status === 400) {
        alert(err.response.data.error?.message || 'Cannot accept plan in current status');
        setState('viewing');
      } else {
        alert('Failed to accept plan. Please try again.');
        setState('viewing');
      }
    }
  };

  // Request modifications
  const handleRequestModifications = async () => {
    setState('requesting_modifications');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/training-plan/${planId}/modification-request`,
        modificationForm,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setState('modification_requested');
        setShowModificationModal(false);
      }
    } catch (err) {
      alert('Failed to submit modification request. Please try again.');
      setState('viewing');
    }
  };

  // Reject plan
  const handleRejectPlan = async () => {
    setState('rejecting');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_BASE_URL}/training-plan/${planId}/reject`,
        rejectForm,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setState('rejected');
        // Navigate to intake form immediately
        navigate('/intake-form');
      }
    } catch (err) {
      alert('Failed to reject plan. Please try again.');
      setState('viewing');
      setShowRejectModal(false);
    }
  };

  // Render loading state
  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your training plan...</p>
        </div>
      </div>
    );
  }

  // Render error states
  if (state === 'error_not_found') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Plan Not Found</h1>
          <p className="text-gray-600 mb-6">{error?.message}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (state === 'error_system') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-orange-500 text-5xl mb-4">🔧</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">System Error</h1>
          <p className="text-gray-600 mb-6">{error?.message}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={loadPlan}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Retry
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render accepting state
  if (state === 'accepting') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Activating your training plan...</p>
        </div>
      </div>
    );
  }

  // Render accepted state
  if (state === 'accepted') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-green-500 text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Plan Activated!</h1>
          <p className="text-gray-600 mb-6">
            Your training plan is now active. Redirecting to dashboard...
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Go to Dashboard Now
          </button>
        </div>
      </div>
    );
  }

  // Render modification requested state
  if (state === 'modification_requested') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-blue-500 text-5xl mb-4">📝</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted</h1>
          <p className="text-gray-600 mb-6">
            Your coach will review your request within 24-48 hours.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Render viewing state (main plan preview)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {planData?.annualPlan.planName || '12-Month Training Plan'}
          </h1>
          <p className="text-gray-600 mt-1">
            {new Date(planData?.annualPlan.startDate).toLocaleDateString()} - {new Date(planData?.annualPlan.endDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-4 overflow-x-auto">
            {['overview', 'calendar', 'weekly', 'periodization', 'tournaments'].map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`py-4 px-6 font-medium capitalize border-b-2 transition-colors whitespace-nowrap ${
                  viewMode === mode
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {viewMode === 'overview' && <OverviewView data={planData} />}
        {viewMode === 'calendar' && <CalendarView data={planData} />}
        {viewMode === 'weekly' && <WeeklyView data={planData} />}
        {viewMode === 'periodization' && <PeriodizationView data={planData} />}
        {viewMode === 'tournaments' && <TournamentsView data={planData} />}

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 justify-center flex-wrap">
          <button
            onClick={handleAcceptPlan}
            className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-lg"
          >
            Accept Training Plan
          </button>
          <button
            onClick={() => setShowModificationModal(true)}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-lg"
          >
            Request Modifications
          </button>
          <button
            onClick={() => setShowRejectModal(true)}
            className="px-8 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-lg"
          >
            Reject Plan
          </button>
        </div>
      </div>

      {/* Modification Request Modal */}
      {showModificationModal && (
        <Modal onClose={() => setShowModificationModal(false)}>
          <h2 className="text-2xl font-bold mb-4">Request Modifications</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What concerns do you have? (Select all that apply)
              </label>
              {['Too many sessions per week', 'Too few rest days', 'Tournament dates conflict', 'Session types not suitable', 'Weekly hours too high'].map(concern => (
                <label key={concern} className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={modificationForm.concerns.includes(concern)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setModificationForm(prev => ({
                          ...prev,
                          concerns: [...prev.concerns, concern]
                        }));
                      } else {
                        setModificationForm(prev => ({
                          ...prev,
                          concerns: prev.concerns.filter(c => c !== concern)
                        }));
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">{concern}</span>
                </label>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (optional)
              </label>
              <textarea
                value={modificationForm.notes}
                onChange={(e) => setModificationForm(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows="4"
                placeholder="Provide more context about your concerns..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgency
              </label>
              <select
                value={modificationForm.urgency}
                onChange={(e) => setModificationForm(prev => ({ ...prev, urgency: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setShowModificationModal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestModifications}
                disabled={modificationForm.concerns.length === 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Request
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Reject Plan Modal */}
      {showRejectModal && (
        <Modal onClose={() => setShowRejectModal(false)}>
          <h2 className="text-2xl font-bold mb-4 text-red-600">Reject Training Plan</h2>
          <p className="text-gray-600 mb-4">
            Are you sure? This will archive this plan and you'll need to create a new intake form.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for rejection (required, min 10 characters)
              </label>
              <textarea
                value={rejectForm.reason}
                onChange={(e) => setRejectForm(prev => ({ ...prev, reason: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows="4"
                placeholder="Please explain why you're rejecting this plan..."
              />
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rejectForm.willCreateNewIntake}
                onChange={(e) => setRejectForm(prev => ({ ...prev, willCreateNewIntake: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm">I will create a new intake form</span>
            </label>
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectPlan}
                disabled={rejectForm.reason.length < 10}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// View Components
function OverviewView({ data }) {
  if (!data) return null;

  const { statistics, periodizations, tournaments } = data;

  return (
    <div className="space-y-6">
      {/* Plan Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Plan Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Total Rest Days" value={statistics.totalRestDays} />
          <StatCard label="Avg Session (min)" value={Math.round(statistics.averageSessionDuration)} />
          <StatCard label="Weeks" value={periodizations.length} />
        </div>
      </div>

      {/* Period Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Training Periods</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <PeriodCard label="Base (E)" count={statistics.periodBreakdown.E || 0} color="bg-blue-100 text-blue-800" />
          <PeriodCard label="General (G)" count={statistics.periodBreakdown.G || 0} color="bg-green-100 text-green-800" />
          <PeriodCard label="Specific (S)" count={statistics.periodBreakdown.S || 0} color="bg-purple-100 text-purple-800" />
          <PeriodCard label="Tournament (T)" count={statistics.periodBreakdown.T || 0} color="bg-yellow-100 text-yellow-800" />
        </div>
      </div>

      {/* Tournaments */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Scheduled Tournaments ({tournaments.length})</h2>
        <div className="space-y-2">
          {tournaments.map(t => (
            <div key={t.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="font-medium">{t.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">{new Date(t.startDate).toLocaleDateString()}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  t.importance === 'A' ? 'bg-red-100 text-red-800' :
                  t.importance === 'B' ? 'bg-orange-100 text-orange-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {t.importance}-Priority
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CalendarView({ data }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">365-Day Calendar</h2>
      <p className="text-gray-600">Calendar visualization coming soon...</p>
      <p className="text-sm text-gray-500 mt-2">
        Total assignments: {data?.dailyAssignments.length}
      </p>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function WeeklyView({ data: _data }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Week-by-Week View</h2>
      <p className="text-gray-600">Weekly breakdown coming soon...</p>
    </div>
  );
}

function PeriodizationView({ data }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Periodization Timeline</h2>
      <div className="space-y-2">
        {data?.periodizations.map(period => (
          <div key={period.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded">
            <div className="w-20 text-sm font-medium">Week {period.weekNumber}</div>
            <div className="flex-1 flex items-center gap-2">
              <span className={`px-3 py-1 rounded font-medium ${
                period.period === 'E' ? 'bg-blue-100 text-blue-800' :
                period.period === 'G' ? 'bg-green-100 text-green-800' :
                period.period === 'S' ? 'bg-purple-100 text-purple-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {period.period}
              </span>
              <span className="text-sm text-gray-600">{period.learningPhase}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TournamentsView({ data }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Tournament Schedule & Preparation</h2>
      <div className="space-y-4">
        {data?.tournaments.map(t => (
          <div key={t.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-lg">{t.name}</h3>
              <span className={`px-3 py-1 rounded font-medium ${
                t.importance === 'A' ? 'bg-red-100 text-red-800' :
                t.importance === 'B' ? 'bg-orange-100 text-orange-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {t.importance}-Priority
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div>📅 Date: {new Date(t.startDate).toLocaleDateString()}</div>
              <div>📍 Week: {t.weekNumber}</div>
              <div>🎯 Topping: Week {t.toppingStartWeek} ({t.toppingDurationWeeks} weeks)</div>
              <div>📉 Tapering: {t.taperingDurationDays} days</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Utility Components
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Modal({ children, onClose: _onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        {children}
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="text-center p-4 bg-gray-50 rounded-lg">
      <div className="text-3xl font-bold text-green-600">{value}</div>
      <div className="text-sm text-gray-600 mt-1">{label}</div>
    </div>
  );
}

function PeriodCard({ label, count, color }) {
  return (
    <div className="text-center p-4 bg-gray-50 rounded-lg">
      <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${color}`}>
        {count} weeks
      </div>
      <div className="text-sm text-gray-600 mt-2">{label}</div>
    </div>
  );
}
