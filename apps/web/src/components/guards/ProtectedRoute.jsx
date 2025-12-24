import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { tokens } from '../../design-tokens';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--ak-snow)',
      }}>
        <div style={{
          textAlign: 'center',
          color: 'var(--ak-steel)',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid var(--ak-mist)',
            borderTopColor: 'var(--ak-primary)',
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 1s linear infinite',
          }} />
          <div>Laster...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div style={{
        padding: '24px',
        textAlign: 'center',
        color: tokens.colors.error,
      }}>
        <h2 style={{ fontSize: '22px', marginBottom: '8px' }}>Ingen tilgang</h2>
        <p>Du har ikke tilgang til denne siden.</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
