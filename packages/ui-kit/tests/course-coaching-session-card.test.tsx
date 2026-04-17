import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CourseCoachingSessionCard } from '../lib/components/available-coaching-sessions/course-coaching-session-card';

describe('CourseCoachingSessionCard', () => {
  const defaultProps = {
    sessionTitle: 'Intro Session',
    sessionDuration: 60,
    courseTitle: 'React Fundamentals',
    durationMinutes: 'minute(s)',
  };

  it('renders session title, duration, and course title', () => {
    render(<CourseCoachingSessionCard {...defaultProps} />);
    expect(screen.getByText('Intro Session')).toBeInTheDocument();
    expect(screen.getByText('60 minute(s)')).toBeInTheDocument();
    expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<CourseCoachingSessionCard {...defaultProps} onClick={handleClick} />);
    fireEvent.click(screen.getByText('Intro Session'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows cursor pointer styling', () => {
    const { container } = render(<CourseCoachingSessionCard {...defaultProps} />);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('cursor-pointer');
  });

  it('renders without durationMinutes', () => {
    const { sessionTitle, sessionDuration, courseTitle } = defaultProps;
    render(
      <CourseCoachingSessionCard
        sessionTitle={sessionTitle}
        sessionDuration={sessionDuration}
        courseTitle={courseTitle}
      />,
    );
    expect(screen.getByText('Intro Session')).toBeInTheDocument();
    expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
  });
});
