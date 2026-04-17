import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AvailableCoachingSessions } from '../lib/components/available-coaching-sessions/available-coaching-sessions';

// Mock the dependencies
vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: (locale: string) => ({
    components: {
      availableCoachingSessions: {
        title: 'Available Coaching Sessions',
        buyMoreSessions: 'Buy More Sessions',
        durationMinutes: 'minute(s)',
        noAvailableSessionText: 'No available sessions',
        loadingText: 'Loading Sessions...',
        standaloneTitle: 'Standalone Coaching Sessions',
        courseTitle: 'Course Coaching Sessions',
      },
    },
  }),
  isLocalAware: vi.fn(),
}));

vi.mock('../lib/components/button', () => ({
  Button: ({ text, className }: { text: string; className: string }) => (
    <button
      className={`justify-center font-bold transition-colors focus:outline-none ${className}`}
    >
      {text}
    </button>
  ),
}));

vi.mock('../lib/components/available-coaching-sessions/available-coaching-session-card', () => ({
  AvailableCoachingSessionCard: ({
    title,
    time,
    durationMinutes,
    numberOfSessions,
  }: {
    title?: string;
    time?: number;
    durationMinutes?: string;
    numberOfSessions?: number;
  }) => (
    <div className="flex gap-2 p-2 items-center justify-between bg-card-stroke border border-divider rounded-medium w-full">
      <div className="flex flex-col gap-1 items-start">
        <p className="text-sm text-text-primary font-bold leading-[100%]">
          {title}
        </p>
        <p className="text-sm text-text-secondary leading-[100%]">
          {time} {durationMinutes}
        </p>
      </div>
      {numberOfSessions && numberOfSessions > 1 && (
        <span className="gap-1 inline-flex font-bold transition-colors bg-base-neutral-400 text-text-primary-inverted rounded-small h-[1.5rem] min-w-[2.0625rem] px-0 py-1 items-center justify-center text-sm leading-[100%]" role="badge">
          <span className="truncate">x{numberOfSessions}</span>
        </span>
      )}
    </div>
  ),
}));

vi.mock('../lib/components/available-coaching-sessions/course-coaching-session-card', () => ({
  CourseCoachingSessionCard: ({
    sessionTitle,
    sessionDuration,
    courseTitle,
    durationMinutes,
    onClick,
  }: {
    sessionTitle: string;
    sessionDuration: number;
    courseTitle: string;
    durationMinutes?: string;
    onClick?: () => void;
  }) => (
    <div data-testid="course-coaching-session-card" onClick={onClick} className="cursor-pointer">
      <p>{sessionTitle}</p>
      <p>{sessionDuration} {durationMinutes}</p>
      <p>{courseTitle}</p>
    </div>
  ),
}));

describe('AvailableCoachingSessions', () => {
  it('renders the title from dictionary', () => {
    render(<AvailableCoachingSessions locale="en" availableCoachingSessionsData={[]} onClickBuyMoreSessions={function (): void {
      throw new Error('Function not implemented.');
    } } />);
    expect(screen.getByText('Available Coaching Sessions')).toBeInTheDocument();
  });

  it('renders default coaching session data when none provided', () => {
    render(<AvailableCoachingSessions locale="en" availableCoachingSessionsData={[]} onClickBuyMoreSessions={function (): void {
      throw new Error('Function not implemented.');
    } } />);
  });

  it('renders provided coaching session data', () => {
    const customData = [
      {
        title: 'Custom Session',
        time: 45,
        numberOfSessions: 2,
      },
    ];
    render(
      <AvailableCoachingSessions
        locale="en"
        availableCoachingSessionsData={customData} onClickBuyMoreSessions={function (): void {
          throw new Error('Function not implemented.');
        } }      />,
    );
    expect(screen.getByText('Custom Session')).toBeInTheDocument();
    expect(screen.getByText('x2')).toBeInTheDocument();
    // Ensure default data is not present
    expect(screen.queryByText('Quick sprint')).not.toBeInTheDocument();
  });

  it('renders Buy More Sessions button with correct text and class', () => {
    render(<AvailableCoachingSessions locale="en" availableCoachingSessionsData={[]} onClickBuyMoreSessions={function (): void {
      throw new Error('Function not implemented.');
    } } />);
    const button = screen.getByRole('button', { name: 'Buy More Sessions' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('w-full');
  });

  it('applies correct container classes', () => {
    const { container } = render(
      <AvailableCoachingSessions
        locale="en"
        availableCoachingSessionsData={[]}
        onClickBuyMoreSessions={vi.fn()}
      />
    );
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass(
      'flex',
      'flex-col',
      'items-start',
      'p-4',
      'gap-[0.875rem]',
      'bg-card-fill',
      'rounded-medium',
      'h-fit',
    );
  });

  describe('with courseCoachingSessionsData', () => {
    const standaloneData = [
      { title: 'Quick Sprint', time: 30, numberOfSessions: 1 },
    ];
    const courseData = [
      {
        courseTitle: 'React Fundamentals',
        courseSlug: 'react-fundamentals',
        sessionTitle: 'Course Intro Session',
        sessionDuration: 60,
        sessionId: 1,
      },
      {
        courseTitle: 'Advanced TypeScript',
        courseSlug: 'advanced-ts',
        sessionTitle: 'TS Deep Dive',
        sessionDuration: 45,
        sessionId: 2,
      },
    ];

    it('renders both Standalone and Course section headers when courseCoachingSessionsData is provided', () => {
      render(
        <AvailableCoachingSessions
          locale="en"
          availableCoachingSessionsData={standaloneData}
          courseCoachingSessionsData={courseData}
          onClickBuyMoreSessions={vi.fn()}
        />,
      );
      expect(screen.getByText('Standalone Coaching Sessions')).toBeInTheDocument();
      expect(screen.getByText('Course Coaching Sessions')).toBeInTheDocument();
    });

    it('does not show section headers when courseCoachingSessionsData is empty', () => {
      render(
        <AvailableCoachingSessions
          locale="en"
          availableCoachingSessionsData={standaloneData}
          courseCoachingSessionsData={[]}
          onClickBuyMoreSessions={vi.fn()}
        />,
      );
      expect(screen.queryByText('Standalone Coaching Sessions')).not.toBeInTheDocument();
      expect(screen.queryByText('Course Coaching Sessions')).not.toBeInTheDocument();
    });

    it('does not show section headers when courseCoachingSessionsData is undefined', () => {
      render(
        <AvailableCoachingSessions
          locale="en"
          availableCoachingSessionsData={standaloneData}
          onClickBuyMoreSessions={vi.fn()}
        />,
      );
      expect(screen.queryByText('Standalone Coaching Sessions')).not.toBeInTheDocument();
      expect(screen.queryByText('Course Coaching Sessions')).not.toBeInTheDocument();
    });

    it('renders course session cards with correct course title', () => {
      render(
        <AvailableCoachingSessions
          locale="en"
          availableCoachingSessionsData={standaloneData}
          courseCoachingSessionsData={courseData}
          onClickBuyMoreSessions={vi.fn()}
        />,
      );
      expect(screen.getByText('Course Intro Session')).toBeInTheDocument();
      expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
      expect(screen.getByText('TS Deep Dive')).toBeInTheDocument();
      expect(screen.getByText('Advanced TypeScript')).toBeInTheDocument();
    });

    it('calls onClickCourseSession when a course session card is clicked', () => {
      const handleClickCourseSession = vi.fn();
      render(
        <AvailableCoachingSessions
          locale="en"
          availableCoachingSessionsData={standaloneData}
          courseCoachingSessionsData={courseData}
          onClickBuyMoreSessions={vi.fn()}
          onClickCourseSession={handleClickCourseSession}
        />,
      );
      const courseCards = screen.getAllByTestId('course-coaching-session-card');
      fireEvent.click(courseCards[0]);
      expect(handleClickCourseSession).toHaveBeenCalledTimes(1);
      expect(handleClickCourseSession).toHaveBeenCalledWith(courseData[0]);
    });
  });
});
