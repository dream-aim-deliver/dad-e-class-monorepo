import { render, screen, fireEvent } from '@testing-library/react';
import { BuyCourseCoachingSessions } from '../lib/components/buy-course-coaching-sessions';
import { vi } from 'vitest';

vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: () => ({
    components: {
      buyCourseCoachingSessions: {
        title: 'Buy Course Coaching Sessions',
        description: 'Purchase additional coaching sessions for this course.',
        minutes: 'minutes',
        total: 'Total',
        buttonText: 'Buy coaching sessions',
        noSessionsAvailable: 'No coaching sessions available for purchase.',
        sessionAvailableSingular: 'session available',
        sessionAvailablePlural: 'sessions available',
        cancelText: 'Cancel',
      }
    }
  }),
  isLocalAware: vi.fn()
}));

const mockCoachingOfferings = [
  {
    id: '1',
    name: 'Web Development Fundamentals',
    price: 50,
    duration: 60,
    currency: 'CHF',
    description: 'Learn the fundamentals of web development',
  },
  {
    id: '2',
    name: 'Advanced React Techniques',
    price: 75,
    duration: 90,
    currency: 'CHF',
    description: 'Master advanced React patterns',
  },
];

const mockCoachingSessions = [
  {
    status: 'not_purchased' as const,
    coachingOfferingTitle: 'Web Development Fundamentals',
    coachingOfferingDuration: 60,
    coachingSessionId: 1,
    lessonComponentId: 'lesson-1',
    lessonId: 1,
    lessonTitle: 'Introduction to Web Development',
    moduleId: 1,
    moduleTitle: 'Module 1: Basics',
    purchaseDate: null,
  },
  {
    status: 'not_purchased' as const,
    coachingOfferingTitle: 'Web Development Fundamentals',
    coachingOfferingDuration: 60,
    coachingSessionId: 2,
    lessonComponentId: 'lesson-2',
    lessonId: 1,
    lessonTitle: 'Introduction to Web Development',
    moduleId: 1,
    moduleTitle: 'Module 1: Basics',
    purchaseDate: null,
  },
  {
    status: 'not_purchased' as const,
    coachingOfferingTitle: 'Advanced React Techniques',
    coachingOfferingDuration: 90,
    coachingSessionId: 3,
    lessonComponentId: 'lesson-3',
    lessonId: 2,
    lessonTitle: 'Advanced React Patterns',
    moduleId: 2,
    moduleTitle: 'Module 2: Advanced',
    purchaseDate: null,
  },
];

describe('BuyCourseCoachingSessions Component', () => {
  const mockOnPurchase = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders component with coaching sessions', () => {
    render(
      <BuyCourseCoachingSessions
        coachingSessions={mockCoachingSessions}
        coachingOfferings={mockCoachingOfferings}
        onPurchase={mockOnPurchase}
        onClose={mockOnClose}
        locale="en"
      />
    );

    expect(screen.getByText('Buy Course Coaching Sessions')).toBeInTheDocument();
    expect(screen.getByText('Purchase additional coaching sessions for this course.')).toBeInTheDocument();
    // Multiple sessions can have the same offering title, so use getAllByText
    expect(screen.getAllByText('Web Development Fundamentals').length).toBeGreaterThan(0);
    expect(screen.getByText('Advanced React Techniques')).toBeInTheDocument();
    expect(screen.getAllByText('50.00 CHF').length).toBeGreaterThan(0);
    expect(screen.getByText('75.00 CHF')).toBeInTheDocument();
  });

  test('filters out purchased sessions', () => {
    const sessionsWithPurchased = [
      ...mockCoachingSessions,
      {
        status: 'purchased' as const,
        coachingOfferingTitle: 'Purchased Session',
        coachingOfferingDuration: 45,
        coachingSessionId: 4,
        lessonComponentId: 'lesson-4',
        lessonId: 3,
        lessonTitle: 'Purchased Lesson',
        moduleId: 3,
        moduleTitle: 'Module 3',
        purchaseDate: '2024-01-15T10:00:00Z',
      },
    ];

    render(
      <BuyCourseCoachingSessions
        coachingSessions={sessionsWithPurchased}
        coachingOfferings={mockCoachingOfferings}
        onPurchase={mockOnPurchase}
        onClose={mockOnClose}
        locale="en"
      />
    );

    expect(screen.queryByText('Purchased Session')).not.toBeInTheDocument();
  });

  test('toggles session selection with checkbox', () => {
    render(
      <BuyCourseCoachingSessions
        coachingSessions={mockCoachingSessions}
        coachingOfferings={mockCoachingOfferings}
        onPurchase={mockOnPurchase}
        onClose={mockOnClose}
        locale="en"
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(0);

    // Check first checkbox
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();

    // Uncheck first checkbox
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).not.toBeChecked();
  });

  test('updates total cost correctly when sessions are selected', () => {
    render(
      <BuyCourseCoachingSessions
        coachingSessions={mockCoachingSessions}
        coachingOfferings={mockCoachingOfferings}
        onPurchase={mockOnPurchase}
        onClose={mockOnClose}
        locale="en"
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    
    // Select first session (50 CHF)
    fireEvent.click(checkboxes[0]);
    expect(screen.getByText((_content, element) => {
      return element?.tagName === 'H6' && !!element?.textContent?.match(/Total.*50\.00.*CHF/);
    })).toBeInTheDocument();

    // Select second session (50 CHF)
    fireEvent.click(checkboxes[1]);
    expect(screen.getByText((_content, element) => {
      return element?.tagName === 'H6' && !!element?.textContent?.match(/Total.*100\.00.*CHF/);
    })).toBeInTheDocument();
  });

  test('disables buy button when no sessions selected', () => {
    render(
      <BuyCourseCoachingSessions
        coachingSessions={mockCoachingSessions}
        coachingOfferings={mockCoachingOfferings}
        onPurchase={mockOnPurchase}
        onClose={mockOnClose}
        locale="en"
      />
    );

    const buyButton = screen.getByRole('button', { name: 'Buy coaching sessions' });
    expect(buyButton).toBeDisabled();
  });

  test('enables buy button when sessions are selected', () => {
    render(
      <BuyCourseCoachingSessions
        coachingSessions={mockCoachingSessions}
        coachingOfferings={mockCoachingOfferings}
        onPurchase={mockOnPurchase}
        onClose={mockOnClose}
        locale="en"
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    const buyButton = screen.getByRole('button', { name: 'Buy coaching sessions' });
    expect(buyButton).not.toBeDisabled();
  });

  test('calls onPurchase with correct lessonComponentIds when buy button is clicked', () => {
    render(
      <BuyCourseCoachingSessions
        coachingSessions={mockCoachingSessions}
        coachingOfferings={mockCoachingOfferings}
        onPurchase={mockOnPurchase}
        onClose={mockOnClose}
        locale="en"
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]); // Select lesson-1
    fireEvent.click(checkboxes[1]); // Select lesson-2

    const buyButton = screen.getByRole('button', { name: 'Buy coaching sessions' });
    fireEvent.click(buyButton);

    expect(mockOnPurchase).toHaveBeenCalledWith(['lesson-1', 'lesson-2']);
  });

  test('calls onClose when cancel button is clicked', () => {
    render(
      <BuyCourseCoachingSessions
        coachingSessions={mockCoachingSessions}
        coachingOfferings={mockCoachingOfferings}
        onPurchase={mockOnPurchase}
        onClose={mockOnClose}
        locale="en"
      />
    );

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  test('shows empty state when no unpurchased sessions available', () => {
    render(
      <BuyCourseCoachingSessions
        coachingSessions={[]}
        coachingOfferings={mockCoachingOfferings}
        onPurchase={mockOnPurchase}
        onClose={mockOnClose}
        locale="en"
      />
    );

    expect(screen.getByText('No coaching sessions available for purchase.')).toBeInTheDocument();
  });

  test('displays lesson and module information for each session', () => {
    render(
      <BuyCourseCoachingSessions
        coachingSessions={mockCoachingSessions}
        coachingOfferings={mockCoachingOfferings}
        onPurchase={mockOnPurchase}
        onClose={mockOnClose}
        locale="en"
      />
    );

    // Multiple sessions can have the same module/lesson titles, so use getAllByText
    expect(screen.getAllByText('Module 1: Basics').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Introduction to Web Development').length).toBeGreaterThan(0);
    expect(screen.getByText('Module 2: Advanced')).toBeInTheDocument();
    expect(screen.getByText('Advanced React Patterns')).toBeInTheDocument();
  });

  test('allows selecting multiple sessions independently', () => {
    render(
      <BuyCourseCoachingSessions
        coachingSessions={mockCoachingSessions}
        coachingOfferings={mockCoachingOfferings}
        onPurchase={mockOnPurchase}
        onClose={mockOnClose}
        locale="en"
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    
    // Select first and third sessions
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[2]);

    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
    expect(checkboxes[2]).toBeChecked();
  });
});

