import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { YourStudentCardList } from '../lib/components/student-card/your-student-card-list';

// Mock getDictionary
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

describe('YourStudentCardList', () => {
    const createMockChild = (text = 'Test Student') => <div>{text}</div>;

    it('renders the empty state when no children are provided', () => {
        render(<YourStudentCardList locale="en" />);
        expect(screen.getByText('No students to show')).toBeInTheDocument();
    });

    it('renders a single child element', () => {
        render(
            <YourStudentCardList locale="en">
                {createMockChild('Single Student')}
            </YourStudentCardList>,
        );
        expect(screen.getByText('Single Student')).toBeInTheDocument();
        expect(screen.getByRole('listitem')).toBeInTheDocument();
    });

    it('renders multiple children correctly', () => {
        render(
            <YourStudentCardList locale="en">
                {[
                    createMockChild('Student 1'),
                    createMockChild('Student 2'),
                    createMockChild('Student 3'),
                ]}
            </YourStudentCardList>,
        );

        expect(screen.getByText('Student 1')).toBeInTheDocument();
        expect(screen.getByText('Student 2')).toBeInTheDocument();
        expect(screen.getByText('Student 3')).toBeInTheDocument();

        const listItems = screen.getAllByRole('listitem');
        expect(listItems).toHaveLength(3);
    });
});
