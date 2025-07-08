import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
    StudentCard,
    StudentCardProps,
} from '../lib/components/student-card/student-card';

describe('StudentCard', () => {
    const mockDate = new Date('2025-03-20T12:00:00');

    const baseProps: StudentCardProps = {
        locale: 'en',
        status: 'default',
        studentName: 'John Doe',
        studentImageUrl: 'https://example.com/student.jpg',
        coachName: 'Jane Smith',
        coachImageUrl: 'https://example.com/coach.jpg',
        courseName: 'React Basics',
        courseImageUrl: 'https://example.com/course.jpg',
        assignmentTitle: 'Assignment 1',
        isYou: false,
        onClickCourse: vi.fn(),
        onClickCoach: vi.fn(),
        completedCourseDate: mockDate,
        onStudentDetails: vi.fn(),
        onViewAssignment: vi.fn(),
    };

    it('renders student name and image', () => {
        render(<StudentCard {...baseProps} />);
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByAltText('John Doe')).toHaveAttribute(
            'src',
            baseProps.studentImageUrl,
        );
    });

    it('renders coach name and image', () => {
        render(<StudentCard {...baseProps} />);
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByAltText('Jane Smith')).toHaveAttribute(
            'src',
            baseProps.coachImageUrl,
        );
    });

    it('renders course name and image', () => {
        render(<StudentCard {...baseProps} />);
        expect(screen.getByText('React Basics')).toBeInTheDocument();
        expect(screen.getByAltText('React Basics')).toHaveAttribute(
            'src',
            baseProps.courseImageUrl,
        );
    });

    it('calls onClickCourse when course is clicked', () => {
        render(<StudentCard {...baseProps} />);
        fireEvent.click(screen.getByText('React Basics'));
        expect(baseProps.onClickCourse).toHaveBeenCalled();
    });

    it('calls onClickCoach when coach is clicked', () => {
        render(<StudentCard {...baseProps} />);
        fireEvent.click(screen.getByText('Jane Smith'));
        expect(baseProps.onClickCoach).toHaveBeenCalled();
    });

    it('does NOT show assignment when status is default', () => {
        render(<StudentCard {...baseProps} />);
        expect(screen.queryByText('Assignment 1')).not.toBeInTheDocument();
    });

    it('shows assignment and badge when status is waiting-feedback', () => {
        render(<StudentCard {...baseProps} status="waiting-feedback" />);
        expect(screen.getByText('Assignment 1')).toBeInTheDocument();
        expect(screen.getByText('Waiting for feedback')).toBeInTheDocument();
    });

    it('shows assignment and badge when status is long-wait', () => {
        render(<StudentCard {...baseProps} status="long-wait" />);
        expect(screen.getByText('Assignment 1')).toBeInTheDocument();
        expect(
            screen.getByText('Waited for more than 48h'),
        ).toBeInTheDocument();
    });

    it('calls onViewAssignment when assignment button clicked', () => {
        render(<StudentCard {...baseProps} status="long-wait" />);
        fireEvent.click(screen.getByText('View assignment'));
        expect(baseProps.onViewAssignment).toHaveBeenCalled();
    });

    it('renders badge if coachingSessionsLeft > 0', () => {
        render(<StudentCard {...baseProps} coachingSessionsLeft={2} />);
        expect(
            screen.getByText(/2 coaching sessions with you/i),
        ).toBeInTheDocument();
    });

    it('does NOT render badge if coachingSessionsLeft is 0', () => {
        render(<StudentCard {...baseProps} coachingSessionsLeft={0} />);
        expect(
            screen.queryByText(/0 Coaching sessions left/i),
        ).not.toBeInTheDocument();
    });

    it('renders completed course badge with formatted date', () => {
        render(<StudentCard {...baseProps} status="course-completed" />);
        expect(
            screen.getByText(/Student completed course on 2025-03-20/),
        ).toBeInTheDocument();
    });

    it('renders "you" text when isYou is true', () => {
        render(<StudentCard {...baseProps} isYou={true} />);
        expect(screen.getByText('You')).toBeInTheDocument();
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument(); // Should not show coach name as button
    });
});
