import { render, screen, fireEvent } from '@testing-library/react';
import { CoachingSessionBuilderView } from '../lib/components/coaching-session-course-builder/coaching-session-builder-view';
import { vi } from 'vitest';
import { CourseElementType } from '../lib/components/course-builder/types';

const mockCoachingSessionTypes = [
  { id: 1, name: 'Session A', duration: 30 },
  { id: 2, name: 'Session B', duration: 60 },
];

describe('CoachingSessionBuilderView Component', () => {
  it('renders all session options with correct labels', () => {
    render(
      <CoachingSessionBuilderView
        type={CourseElementType.CoachingSession}
        id={101}
        order={1}
        coachingSessionTypes={mockCoachingSessionTypes}
        onChange={vi.fn()}
        locale='en'
      />
    );

    expect(screen.getByText('Session A')).toBeInTheDocument();
    expect(screen.getByText('30 min')).toBeInTheDocument();
    expect(screen.getByText('Session B')).toBeInTheDocument();
    expect(screen.getByText('60 min')).toBeInTheDocument();
  });

  it('calls onChange with correct payload when selecting sessions', () => {
    const mockOnChange = vi.fn();
    
    render(
      <CoachingSessionBuilderView
        type={CourseElementType.CoachingSession}
        id={202}
        order={2}
        coachingSessionTypes={mockCoachingSessionTypes}
        onChange={mockOnChange}
        locale='en'
      />
    );

    const [firstRadio, secondRadio] = screen.getAllByRole('radio');

    // Test first session selection
    fireEvent.click(firstRadio);
    expect(mockOnChange).toHaveBeenCalledWith({
      type: 'coachingSession',
      id: 202,
      order: 2,
      coachingOfferingTypeId: 1,
    });

    // Test second session selection
    fireEvent.click(secondRadio);
    expect(mockOnChange).toHaveBeenCalledWith({
      type: 'coachingSession',
      id: 202,
      order: 2,
      coachingOfferingTypeId: 2,
    });
  });

  it('maintains single selection state', () => {
    const { rerender } = render(
      <CoachingSessionBuilderView
        type={CourseElementType.CoachingSession}
        id={303}
        order={3}
        coachingSessionTypes={mockCoachingSessionTypes}
        onChange={vi.fn()}
        locale='en'
      />
    );

    const [firstRadio, secondRadio] = screen.getAllByRole('radio');

    // Initial state - no selection
    expect(firstRadio).not.toBeChecked();
    expect(secondRadio).not.toBeChecked();

    // Select first option
    fireEvent.click(firstRadio);
    expect(firstRadio).toBeChecked();
    expect(secondRadio).not.toBeChecked();

    // Select second option
    fireEvent.click(secondRadio);
    expect(firstRadio).not.toBeChecked();
    expect(secondRadio).toBeChecked();
  });
});
