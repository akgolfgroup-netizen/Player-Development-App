import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingState from '../LoadingState';

describe('LoadingState', () => {
  it('renders loading spinner', () => {
    render(<LoadingState />);
    expect(screen.getByText('Laster...')).toBeInTheDocument();
  });

  it('renders custom message', () => {
    render(<LoadingState message="Henter data..." />);
    expect(screen.getByText('Henter data...')).toBeInTheDocument();
  });

  it('displays spinner element', () => {
    const { container } = render(<LoadingState />);
    const spinner = container.querySelector('div[style*="animation"]');
    expect(spinner).toBeInTheDocument();
  });

  it('uses correct styling from design tokens', () => {
    const { container } = render(<LoadingState />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveStyle({ display: 'flex' });
  });
});
