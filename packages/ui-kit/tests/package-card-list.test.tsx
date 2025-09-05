import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PackageCardList } from '../lib/components/packages/package-card-list';

describe('PackageCardList', () => {
    const defaultProps = {
        locale: 'en' as 'en' | 'de',
        children: <div>Child Component</div>,
    };

    it('renders children components', () => {
        render(<PackageCardList {...defaultProps} />);

        expect(screen.getByText('Child Component')).toBeInTheDocument();
    });

    it('applies correct container classes', () => {
        const { container } = render(<PackageCardList {...defaultProps} />);
        const containerDiv = container.firstChild;
        expect(containerDiv).toHaveClass(
            'flex',
            'flex-col',
            'gap-4',
            'justify-center',
            'items-center',
        );
    });

    it('renders wrapper for children with correct classes', () => {
        const { container } = render(<PackageCardList {...defaultProps} />);
        const childrenWrapper = container.querySelector('div[role="list"]');
        expect(childrenWrapper).toHaveClass(
            'grid',
            'grid-cols-1',
            'sm:grid-cols-1',
            'md:grid-cols-2',
            'lg:grid-cols-3',
            'gap-3',
        );
    });

    it('hides the 3rd child on small/medium screens', () => {
        const { container } = render(
            <PackageCardList {...defaultProps}>
                <div>Card 1</div>
                <div>Card 2</div>
                <div>Card 3</div>
            </PackageCardList>,
        );

        const thirdCard = container.querySelectorAll('[role="listitem"]')[2];
        expect(thirdCard).toHaveClass('hidden', 'lg:block');
    });
});
