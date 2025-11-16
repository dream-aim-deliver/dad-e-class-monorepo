import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { StudentCard, StudentCardProps } from '../lib/components/student-card/student-card';
import * as translations from '@maany_shr/e-class-translations';

describe('StudentCard', () => {
    const mockDictionary = {
        components: {
            studentCard: {
                coachingSessionsLeftText: 'coaching sessions left',
                waitingFeedbackBadge: 'Waiting for feedback',
                longWaitBadge: 'Waited for more than 48h',
                viewAssignment: 'View assignment',
                completedCourseBadge: 'Completed on',
                coach: 'Coach',
                course: 'Course',
                you: 'You',
                studentDetailsButton: 'View student details',
            },
        },
    };

    beforeEach(() => {
        vi.spyOn(translations, 'getDictionary').mockImplementation(() => mockDictionary);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    const baseProps: Omit<StudentCardProps, 'status'> = {
        studentName: 'Alice Smith',
        studentImageUrl: 'https://example.com/student.jpg',
        coachName: 'Bob Coach',
        coachImageUrl: 'https://example.com/coach.jpg',
        courseName: 'React Fundamentals',
        courseImageUrl: 'https://example.com/course.jpg',
        onStudentDetails: vi.fn(),
        onClickCoach: vi.fn(),
        onClickCourse: vi.fn(),
        isYou: false,
        locale: 'en',
    };

    it('renders student name, avatar, and coaching sessions badge', () => {
        render(
            <StudentCard
                {...baseProps}
                coachingSessionsLeft={2}
                status="no-assignment"
            />
        );

        expect(screen.getByText('Alice Smith')).toBeInTheDocument();
        expect(screen.getByRole('img', { name: /alice smith/i })).toHaveAttribute(
            'src',
            'https://example.com/student.jpg'
        );
        expect(screen.getByText(/2 coaching sessions left/i)).toBeInTheDocument();
    });

    it('renders coach with avatar and triggers onClickCoach if not you', () => {
        render(<StudentCard {...baseProps} status="no-assignment" />);

        const coachButton = screen.getByRole('button', { name: /bob coach/i });
        expect(coachButton).toBeInTheDocument();
        fireEvent.click(coachButton);
        expect(baseProps.onClickCoach).toHaveBeenCalled();
    });

    it('renders coach as "You" if isYou is true', () => {
        render(
            <StudentCard
                {...baseProps}
                isYou
                status="no-assignment"
            />
        );

        expect(screen.getByText('You')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /bob coach/i })).not.toBeInTheDocument();
    });

    it('calls onClickCourse when course button is clicked', () => {
        render(<StudentCard {...baseProps} status="no-assignment" />);
        const courseButton = screen.getByRole('button', { name: /react fundamentals/i });
        fireEvent.click(courseButton);
        expect(baseProps.onClickCourse).toHaveBeenCalled();
    });

    it('renders waiting-feedback status with badge and assignment title', () => {
        render(
            <StudentCard
                {...baseProps}
                status="waiting-feedback"
                assignmentTitle="Assignment Alpha"
                onViewAssignment={vi.fn()}
            />
        );

        expect(screen.getByText('Assignment Alpha')).toBeInTheDocument();
        expect(screen.getByText(/Waiting for feedback/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /view assignment/i })).toBeInTheDocument();
    });

    it('renders long-wait status with proper badge', () => {
        render(
            <StudentCard
                {...baseProps}
                status="long-wait"
                assignmentTitle="Assignment Beta"
                onViewAssignment={vi.fn()}
            />
        );

        expect(screen.getByText('Assignment Beta')).toBeInTheDocument();
        expect(screen.getByText(/Waited for more than 48h/i)).toBeInTheDocument();
    });

    it('calls onViewAssignment when clicking view assignment button', () => {
        const onViewAssignment = vi.fn();
        render(
            <StudentCard
                {...baseProps}
                status="waiting-feedback"
                assignmentTitle="Assignment Gamma"
                onViewAssignment={onViewAssignment}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: /view assignment/i }));
        expect(onViewAssignment).toHaveBeenCalled();
    });

    it('renders course completed badge with date', () => {
        render(
            <StudentCard
                {...baseProps}
                status="passed"
                completedCourseDate={new Date('2025-04-10')}
            />
        );

        expect(screen.getByText(/Completed on 2025-04-10/)).toBeInTheDocument();
    });

    it('calls onStudentDetails when clicking "View student details"', () => {
        render(
            <StudentCard
                {...baseProps}
                status="no-assignment"
            />
        );

        fireEvent.click(screen.getByRole('button', { name: /view student details/i }));
        expect(baseProps.onStudentDetails).toHaveBeenCalled();
    });
});
