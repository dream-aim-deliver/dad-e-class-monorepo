import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { StudentCardList } from '../lib/components/student-card/student-card-list';
import * as translations from '@maany_shr/e-class-translations';

describe('StudentCardList', () => {
    const mockDictionary = {
        components: {
            studentCard: {
                emptyState: 'No students available',
            },
        },
    };

    beforeEach(() => {
        vi.spyOn(translations, 'getDictionary').mockReturnValue(mockDictionary);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('shows empty state when no children are provided', () => {
        render(<StudentCardList locale="en" />);

        expect(screen.getByText('No students available')).toBeInTheDocument();
    });

    it('renders a single child correctly', () => {
        render(
            <StudentCardList locale="en">
                <div>Single Student</div>
            </StudentCardList>
        );

        expect(screen.getByRole('list')).toBeInTheDocument();
        expect(screen.getByRole('listitem')).toHaveTextContent('Single Student');
    });

    it('renders multiple children correctly', () => {
        render(
            <StudentCardList locale="en">
                {[<div key="1">Student 1</div>, <div key="2">Student 2</div>]}
            </StudentCardList>
        );

        expect(screen.getByRole('list')).toBeInTheDocument();
        const items = screen.getAllByRole('listitem');
        expect(items).toHaveLength(2);
        expect(items[0]).toHaveTextContent('Student 1');
        expect(items[1]).toHaveTextContent('Student 2');
    });
});
