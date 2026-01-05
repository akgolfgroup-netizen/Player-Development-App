/**
 * ModificationRequestDashboard Component
 * Design System v3.0 - Premium Light
 *
 * MIGRATED TO PAGE ARCHITECTURE - Minimal inline styles (dynamic colors)
 */

import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../../services/apiClient';
import Button from '../../ui/primitives/Button';
import { PageTitle, SubSectionTitle, CardTitle } from '../../components/typography';

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
      const { data } = await apiClient.get(
        `/training-plan/modification-requests?status=${filter}`
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
      await apiClient.put(
        `/training-plan/modification-requests/${requestId}/respond`,
        { response, status: responseStatus }
      );
      setRespondingTo(null);
      setResponse('');
      loadRequests();
    } catch (err) {
      alert('Kunne ikke sende svar: ' + (err.message || 'Ukjent feil'));
    }
  };

  const urgencyColor = {
    low: 'var(--ak-text-secondary)',
    medium: 'var(--ak-status-warning)',
    high: 'var(--ak-status-error)',
  };

  const statusBadge = {
    pending: { bg: 'var(--ak-status-warning-light)', text: 'var(--ak-status-warning)', label: 'Venter' },
    under_review: { bg: 'var(--ak-primary-light)', text: 'var(--ak-primary)', label: 'Under behandling' },
    resolved: { bg: 'var(--ak-status-success-light)', text: 'var(--ak-status-success)', label: 'Løst' },
    rejected: { bg: 'var(--ak-status-error-light)', text: 'var(--ak-status-error)', label: 'Avvist' },
  };

  if (loading) return <div className="p-8">Laster forespørsler...</div>;

  return (
    <div className="p-8">
      <div className="mb-6">
        <PageTitle className="mb-2">Endringsforespørsler</PageTitle>
        <p className="text-gray-600">Gjennomgå og svar på spillernes endringsforespørsler</p>
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
          Ingen {filter.replace('_', ' ')} forespørsler funnet
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(req => (
            <div key={req.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <SubSectionTitle>{req.playerName}</SubSectionTitle>
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
                <CardTitle className="text-amber-900 mb-2">Bekymringer:</CardTitle>
                <ul className="list-disc list-inside space-y-1">
                  {req.concerns.map((concern, i) => (
                    <li key={i} className="text-amber-800">{concern}</li>
                  ))}
                </ul>
                {req.notes && (
                  <div className="mt-3">
                    <p className="font-bold text-amber-900">Tilleggsnotater:</p>
                    <p className="text-amber-800">{req.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Opprettet: {new Date(req.createdAt).toLocaleString('nb-NO')}</span>
                {req.reviewedAt && (
                  <span>Gjennomgått: {new Date(req.reviewedAt).toLocaleString('nb-NO')}</span>
                )}
              </div>

              {req.status === 'pending' && (
                <div className="mt-4">
                  {respondingTo === req.id ? (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <textarea
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        placeholder="Ditt svar til spilleren..."
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
                          <span className="text-green-700 font-medium">Løst</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="status"
                            value="rejected"
                            checked={responseStatus === 'rejected'}
                            onChange={(e) => setResponseStatus(e.target.value)}
                          />
                          <span className="text-red-700 font-medium">Avvist</span>
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          onClick={() => handleRespond(req.id)}
                          disabled={response.length < 10}
                        >
                          Send svar
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setRespondingTo(null);
                            setResponse('');
                          }}
                        >
                          Avbryt
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={() => setRespondingTo(req.id)}
                    >
                      Svar
                    </Button>
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
