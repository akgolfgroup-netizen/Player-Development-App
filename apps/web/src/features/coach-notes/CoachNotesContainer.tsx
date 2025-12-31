// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { notesAPI, playersAPI } from '../../services/api';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import CoachNotes from './CoachNotes';

type CoachNote = {
  id: string;
  content: string;
  createdAt: string;
  delivered: boolean;
};

/**
 * CoachNotesContainer
 * Fetches notes for a player and provides mutation handlers.
 */
const CoachNotesContainer: React.FC = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [state, setState] = useState<'loading' | 'idle' | 'error'>('loading');
  const [error, setError] = useState<Error | null>(null);
  const [notes, setNotes] = useState<CoachNote[]>([]);
  const [athleteName, setAthleteName] = useState('Spiller');

  const fetchData = useCallback(async () => {
    if (!playerId) return;

    try {
      setState('loading');
      setError(null);

      // Fetch player info and notes in parallel
      const [playerRes, notesRes] = await Promise.all([
        playersAPI.getById(playerId).catch(() => ({ data: null })),
        notesAPI.getForPlayer(playerId).catch(() => ({ data: null })),
      ]);

      // Extract player name
      const playerData = playerRes.data?.data || playerRes.data;
      if (playerData) {
        setAthleteName(
          `${playerData.firstName || ''} ${playerData.lastName || ''}`.trim() || 'Spiller'
        );
      }

      // Transform notes to expected format
      const notesData = notesRes.data?.data || notesRes.data || [];
      if (Array.isArray(notesData)) {
        const transformedNotes: CoachNote[] = notesData.map((note: any) => ({
          id: note.id,
          content: note.content || note.text || note.message || '',
          createdAt: note.createdAt || note.created_at || new Date().toISOString(),
          delivered: note.delivered ?? note.isDelivered ?? true,
        }));
        setNotes(transformedNotes);
      }

      setState('idle');
    } catch (err: any) {
      console.error('Error fetching notes:', err);
      setError(err);
      setState('error');
    }
  }, [playerId]);

  useEffect(() => {
    if (user && playerId) {
      fetchData();
    }
  }, [user, playerId, fetchData]);

  const handleAddNote = async (athleteId: string, content: string) => {
    try {
      // Create note via API
      await notesAPI.create({
        playerId: athleteId,
        content,
      });

      // Refresh notes
      await fetchData();
    } catch (err: any) {
      console.error('Error adding note:', err);
      // Optimistic update on failure - add to local state
      const newNote: CoachNote = {
        id: `temp-${Date.now()}`,
        content,
        createdAt: new Date().toISOString(),
        delivered: false,
      };
      setNotes((prev) => [newNote, ...prev]);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (state === 'loading') {
    return <LoadingState message="Laster notater..." />;
  }

  if (state === 'error') {
    return (
      <ErrorState
        errorType={(error as any)?.type}
        message={error?.message || 'Kunne ikke laste notater'}
        onRetry={fetchData}
      />
    );
  }

  return (
    <CoachNotes
      athleteId={playerId!}
      athleteName={athleteName}
      notes={notes.length > 0 ? notes : undefined}
      onAddNote={handleAddNote}
      onBack={handleBack}
    />
  );
};

export default CoachNotesContainer;
