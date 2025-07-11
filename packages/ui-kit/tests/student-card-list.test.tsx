import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StudentCardList } from '../lib/components/student-card/student-card-list';
import {
    StudentCard,
    StudentCardProps,
} from '../lib/components/student-card/student-card';

vi.mock('@maany_shr/e-class-translations', () => ({
    getDictionary: () => ({
        components: {
            studentCard: {
                emptyState: 'No students to show',
            },
        },
    }),
    isLocalAware: {},
}));

describe('StudentCardList', () => {
    const mockDate = new Date('2025-03-20T12:00:00');

    const createMockStudentCard = (props: Partial<StudentCardProps> = {}) => (
        <StudentCard
            locale="en"
            status="default"
            studentName="John Doe"
            studentImageUrl="https://example.com/student.jpg"
            coachName="Jane Smith"
            coachImageUrl="https://example.com/coach.jpg"
            courseName="React Basics"
            courseImageUrl="https://example.com/course.jpg"
            assignmentTitle="Assignment 1"
            isYou={false}
            onClickCourse={vi.fn()}
            onClickCoach={vi.fn()}
            completedCourseDate={mockDate}
            onStudentDetails={vi.fn()}
            onViewAssignment={vi.fn()}
            {...props}
        />
    );

    const mockCards = Array(5)
        .fill(0)
        .map(() => createMockStudentCard());

    it('renders correct number of student cards', () => {
        render(<StudentCardList locale="en">{mockCards}</StudentCardList>);
        const studentNames = screen.getAllByText('John Doe');
        expect(studentNames).toHaveLength(5);
    });

    it('renders single student card correctly', () => {
        render(
            <StudentCardList locale="en">
                {createMockStudentCard()}
            </StudentCardList>,
        );
        expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('renders empty state when no children provided', () => {
        render(<StudentCardList locale="en" />);
        expect(screen.getByText('No students to show')).toBeInTheDocument();
    });
});
