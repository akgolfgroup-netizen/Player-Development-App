import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { tokens } from '../../design-tokens';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api/v1';

export default function ModificationRequestDashboard() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState(null);
  const [response, setResponse] = useState('');
  const [responseStatus, setResponseStatus] = useState('resolved');

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(
        `${API_BASE}/training-plan/modification-requests?status=${filter}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests(data.data.requests);
    } catch (err) {
      console.error('Failed to load requests:', err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleRespond = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_BASE}/training-plan/modification-requests/${requestId}/respond`,
        { response, status: responseStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRespondingTo(null);
      setResponse('');
      loadRequests();
    } catch (err) {
      alert('Failed to send response: ' + (err.response?.data?.error?.message || err.message));
    }
  };

  const urgencyColor = {
    low: tokens.colors.steel,
    medium: tokens.colors.warning,
    high: tokens.colors.error,
  };

  const statusBadge = {
    pending: { bg: `${tokens.colors.warning}20`, text: tokens.colors.warning, label: 'Pending' },
    under_review: { bg: `${tokens.colors.primary}20`, text: tokens.colors.primary, label: 'Under Review' },
    resolved: { bg: `${tokens.colors.success}20`, text: tokens.colors.success, label: 'Resolved' },
    rejected: { bg: `${tokens.colors.error}20`, text: tokens.colors.error, label: 'Rejected' },
  };

  if (loading) return <div className="p-8">Loading requests...</div>;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Modification Requests</h1>
        <p className="text-gray-600">Review and respond to player modification requests</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {['pending', 'under_review', 'resolved', 'rejected'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium capitalize ${
              filter === status
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Requests List */}
      {requests.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          No {filter} requests found
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(req => (
            <div key={req.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{req.playerName}</h3>
                  <p className="text-gray-600">{req.planName}</p>
                  <p className="text-sm text-gray-500">{req.playerEmail}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <span
                    style={{
                      backgroundColor: statusBadge[req.status].bg,
                      color: statusBadge[req.status].text,
                    }}
                    className="px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {statusBadge[req.status].label}
                  </span>
                  <span
                    style={{ color: urgencyColor[req.urgency] }}
                    className="text-sm font-bold uppercase"
                  >
                    {req.urgency}
                  </span>
                </div>
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
                <h4 className="font-bold text-amber-900 mb-2">Concerns:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {req.concerns.map((concern, i) => (
                    <li key={i} className="text-amber-800">{concern}</li>
                  ))}
                </ul>
                {req.notes && (
                  <div className="mt-3">
                    <p className="font-bold text-amber-900">Additional Notes:</p>
                    <p className="text-amber-800">{req.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Created: {new Date(req.createdAt).toLocaleString()}</span>
                {req.reviewedAt && (
                  <span>Reviewed: {new Date(req.reviewedAt).toLocaleString()}</span>
                )}
              </div>

              {req.status === 'pending' && (
                <div className="mt-4">
                  {respondingTo === req.id ? (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <textarea
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        placeholder="Your response to the player..."
                        className="w-full p-3 border rounded-lg mb-3"
                        rows="4"
                      />
                      <div className="flex gap-2 items-center mb-3">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="status"
                            value="resolved"
                            checked={responseStatus === 'resolved'}
                            onChange={(e) => setResponseStatus(e.target.value)}
                          />
                          <span className="text-green-700 font-medium">Resolved</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="status"
                            value="rejected"
                            checked={responseStatus === 'rejected'}
                            onChange={(e) => setResponseStatus(e.target.value)}
                          />
                          <span className="text-red-700 font-medium">Rejected</span>
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRespond(req.id)}
                          disabled={response.length < 10}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                          Send Response
                        </button>
                        <button
                          onClick={() => {
                            setRespondingTo(null);
                            setResponse('');
                          }}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setRespondingTo(req.id)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                      Respond
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
