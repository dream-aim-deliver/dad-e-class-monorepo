import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RatingDisplay } from '../lib/components/rating-display';

describe('<RatingDisplay /> interactive', () => {
  it('calls onActivate when stars are clicked', () => {
    const onActivate = vi.fn();
    render(
      <RatingDisplay
        rating={4.5}
        totalRatings={12}
        onActivate={onActivate}
        tooltip="Rate this course"
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Rate this course' }));
    expect(onActivate).toHaveBeenCalledTimes(1);
  });

  it('shows blocked hint instead of calling onActivate', () => {
    const onActivate = vi.fn();
    render(
      <RatingDisplay
        rating={4.5}
        totalRatings={12}
        onActivate={onActivate}
        blockedHint="Start the course to rate it."
        tooltip="Rate this course"
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Rate this course' }));
    expect(onActivate).not.toHaveBeenCalled();
    expect(screen.getByRole('status')).toHaveTextContent(
      'Start the course to rate it.',
    );
  });

  it('renders rate entry label with empty stars', () => {
    render(
      <RatingDisplay
        rating={4.5}
        totalRatings={0}
        isRateEntry
        rateEntryLabel="Rate"
        onActivate={vi.fn()}
        tooltip="Rate this course"
      />,
    );

    expect(screen.getByText('Rate')).toBeInTheDocument();
    expect(screen.queryByText('4.5')).not.toBeInTheDocument();
  });

  it('supports keyboard activation', () => {
    const onActivate = vi.fn();
    render(
      <RatingDisplay
        rating={4}
        totalRatings={3}
        onActivate={onActivate}
        tooltip="Rate this course"
      />,
    );

    const control = screen.getByRole('button', { name: 'Rate this course' });
    fireEvent.keyDown(control, { key: 'Enter' });
    expect(onActivate).toHaveBeenCalledTimes(1);
  });
});
