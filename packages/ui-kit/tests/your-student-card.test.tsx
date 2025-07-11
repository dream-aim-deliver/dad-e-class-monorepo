import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
    YourStudentCard,
    CourseAssignment,
} from '../lib/components/student-card/your-student-card';
import * as translations from '@maany_shr/e-class-translations';

describe('YourStudentCard', () => {
    const mockDictionary = {
        components: {
            studentCard: {
                coachingSessionsLeftText: 'coaching sessions left',
                waitingFeedbackBagde: 'Waiting for feedback',
                longWaitBadge: 'Waited for more than 48h',
                viewAssignment: 'View assignment',
                completedOnBadge: 'Completed on',
                studentDetailsButton: 'View student details',
            },
        },
    };

    beforeEach(() => {
        vi.spyOn(translations, 'getDictionary').mockImplementation(
            () => mockDictionary,
        );
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    const onClickCourseMock = vi.fn();
    const onViewAssignmentMock = vi.fn();
    const onStudentDetailsMock = vi.fn();

    const baseCourses: CourseAssignment[] = [
        {
            courseName: 'React Basics',
            courseImageUrl: 'https://example.com/react.jpg',
            assignmentTitle: 'Assignment 1',
            status: 'waiting-feedback',
            onClickCourse: onClickCourseMock,
            onViewAssignment: onViewAssignmentMock,
        },
        {
            courseName: 'Vue Advanced',
            courseImageUrl: 'https://example.com/vue.jpg',
            assignmentTitle: 'Assignment 2',
            status: 'long-wait',
            onClickCourse: onClickCourseMock,
            onViewAssignment: onViewAssignmentMock,
        },
        {
            courseName: 'Angular Intro',
            courseImageUrl: 'https://example.com/angular.jpg',
            assignmentTitle: 'Assignment 3',
            status: 'default',
            onClickCourse: onClickCourseMock,
        },
        {
            courseName: 'Svelte Pro',
            courseImageUrl: 'https://example.com/svelte.jpg',
            assignmentTitle: 'Assignment 4',
            status: 'course-completed',
            completedCourseDate: new Date('2025-03-20'),
            onClickCourse: onClickCourseMock,
        },
    ];

    it('renders student name, avatar and coaching sessions left badge', () => {
        render(
            <YourStudentCard
                studentName="John Doe"
                studentImageUrl="https://example.com/student.jpg"
                coachingSessionsLeft={3}
                courses={[]}
                onStudentDetails={onStudentDetailsMock}
                locale="en"
            />,
        );

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByRole('img', { name: /john doe/i })).toHaveAttribute(
            'src',
            'https://example.com/student.jpg',
        );
        expect(
            screen.getByText(/3 coaching sessions left/i),
        ).toBeInTheDocument();
    });

    it('calls onClickCourse when clicking course button', () => {
        render(
            <YourStudentCard
                studentName="John Doe"
                studentImageUrl="https://example.com/student.jpg"
                courses={[baseCourses[0]]}
                onStudentDetails={onStudentDetailsMock}
                locale="en"
            />,
        );

        const button = screen.getByRole('button', { name: /react basics/i });
        fireEvent.click(button);
        expect(onClickCourseMock).toHaveBeenCalled();
    });

    it('calls onViewAssignment when clicking view assignment button', () => {
        render(
            <YourStudentCard
                studentName="John Doe"
                studentImageUrl="https://example.com/student.jpg"
                courses={[baseCourses[1]]}
                onStudentDetails={onStudentDetailsMock}
                locale="en"
            />,
        );

        const viewAssignmentButton = screen.getByRole('button', {
            name: /view assignment/i,
        });
        fireEvent.click(viewAssignmentButton);
        expect(onViewAssignmentMock).toHaveBeenCalled();
    });

    it('calls onStudentDetails when clicking student details button', () => {
        render(
            <YourStudentCard
                studentName="John Doe"
                studentImageUrl="https://example.com/student.jpg"
                courses={[]}
                onStudentDetails={onStudentDetailsMock}
                locale="en"
            />,
        );

        const studentDetailsButton = screen.getByRole('button', {
            name: /view student details/i,
        });
        fireEvent.click(studentDetailsButton);
        expect(onStudentDetailsMock).toHaveBeenCalled();
    });
});
