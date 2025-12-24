import React from 'react';
import { render, screen } from '@testing-library/react';
import EmptyState from '../EmptyState';

describe('EmptyState', () => {
  it('renders title and message', () => {
    render(<EmptyState title="No Data" message="Nothing to show" />);
    expect(screen.getByText('No Data')).toBeInTheDocument();
    expect(screen.getByText('Nothing to show')).toBeInTheDocument();
  });

  it('renders CTA button when provided', () => {
    render(
      <EmptyState
        title="No Data"
        message="Nothing to show"
        ctaText="Add Item"
        onCtaClick={() => {}}
      />
    );
    expect(screen.getByRole('button', { name: 'Add Item' })).toBeInTheDocument();
  });

  it('does not render CTA button when not provided', () => {
    render(<EmptyState title="No Data" message="Nothing to show" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onCtaClick when CTA button clicked', () => {
    const handleClick = jest.fn();
    render(
      <EmptyState
        title="No Data"
        message="Nothing to show"
        ctaText="Add Item"
        onCtaClick={handleClick}
      />
    );

    const button = screen.getByRole('button', { name: 'Add Item' });
    button.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
