import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FilterSwitch from '../lib/components/filter-switch';

vi.mock('../lib/components/button', () => ({
    Button: ({ text, onClick, variant }: { text: string; onClick?: () => void; variant?: string }) => (
        <button onClick={onClick} data-variant={variant}>{text}</button>
    ),
}));

const topics = [
    { name: 'React', slug: 'react' },
    { name: 'Next.js', slug: 'nextjs' },
    { name: 'Vue', slug: 'vue' },
];

describe('FilterSwitch', () => {
    it('renders the title', () => {
        render(
            <FilterSwitch
                title="Filter by Topic"
                list={topics}
                selectedTopics={[]}
                setSelectedTopics={vi.fn()}
            />,
        );
        expect(screen.getByText('Filter by Topic')).toBeInTheDocument();
    });

    it('renders all topic buttons', () => {
        render(
            <FilterSwitch
                title="Topics"
                list={topics}
                selectedTopics={[]}
                setSelectedTopics={vi.fn()}
            />,
        );
        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('Next.js')).toBeInTheDocument();
        expect(screen.getByText('Vue')).toBeInTheDocument();
    });

    it('calls setSelectedTopics with slug added when clicking unselected topic', () => {
        const setSelectedTopics = vi.fn();
        render(
            <FilterSwitch
                title="Topics"
                list={topics}
                selectedTopics={[]}
                setSelectedTopics={setSelectedTopics}
            />,
        );
        fireEvent.click(screen.getByText('React'));
        expect(setSelectedTopics).toHaveBeenCalledWith(['react']);
    });

    it('calls setSelectedTopics with slug removed when clicking selected topic (deselect)', () => {
        const setSelectedTopics = vi.fn();
        render(
            <FilterSwitch
                title="Topics"
                list={topics}
                selectedTopics={['react', 'vue']}
                setSelectedTopics={setSelectedTopics}
            />,
        );
        fireEvent.click(screen.getByText('React'));
        expect(setSelectedTopics).toHaveBeenCalledWith(['vue']);
    });

    it('deselecting the last topic results in empty array (restore all)', () => {
        const setSelectedTopics = vi.fn();
        render(
            <FilterSwitch
                title="Topics"
                list={topics}
                selectedTopics={['react']}
                setSelectedTopics={setSelectedTopics}
            />,
        );
        fireEvent.click(screen.getByText('React'));
        expect(setSelectedTopics).toHaveBeenCalledWith([]);
    });

    it('calls onFilterChange callback when provided', () => {
        const onFilterChange = vi.fn();
        const setSelectedTopics = vi.fn();
        render(
            <FilterSwitch
                title="Topics"
                list={topics}
                selectedTopics={[]}
                setSelectedTopics={setSelectedTopics}
                onFilterChange={onFilterChange}
            />,
        );
        fireEvent.click(screen.getByText('Next.js'));
        expect(onFilterChange).toHaveBeenCalledWith(['nextjs']);
    });

    it('renders only the title when list is empty', () => {
        render(
            <FilterSwitch
                title="Topics"
                list={[]}
                selectedTopics={[]}
                setSelectedTopics={vi.fn()}
            />,
        );
        expect(screen.getByText('Topics')).toBeInTheDocument();
        expect(screen.queryAllByRole('button')).toHaveLength(0);
    });

    it('uses primary variant for selected topics and secondary for unselected', () => {
        render(
            <FilterSwitch
                title="Topics"
                list={topics}
                selectedTopics={['react']}
                setSelectedTopics={vi.fn()}
            />,
        );
        expect(screen.getByText('React')).toHaveAttribute('data-variant', 'primary');
        expect(screen.getByText('Next.js')).toHaveAttribute('data-variant', 'secondary');
        expect(screen.getByText('Vue')).toHaveAttribute('data-variant', 'secondary');
    });
});
