import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
    ReviewSnippet,
    ReviewSnippetProps,
} from '../lib/components/review/review-snippet';

// Mock dependencies
vi.mock('@maany_shr/e-class-translations', () => ({
    getDictionary: (locale: string) => ({
        components: {
            reviewSnippet: {
                by: 'by',
                readMore: 'Read more',
                readLess: 'Read less',
            },
        },
    }),
    isLocalAware: vi.fn(),
}));

vi.mock('../lib/components/star-rating', () => ({
    StarRating: ({
        rating,
        totalStars,
    }: {
        rating: number;
        totalStars: number;
    }) => (
        <div data-testid="star-rating">{`Rating: ${rating}/${totalStars}`}</div>
    ),
}));

vi.mock('../lib/components/avatar/user-avatar', () => ({
    UserAvatar: ({
        fullName,
        size,
        imageUrl,
    }: {
        fullName: string;
        size: string;
        imageUrl: string;
    }) => (
        <img
            data-testid="user-avatar"
            src={imageUrl}
            alt={fullName}
            className={`avatar-${size}`}
        />
    ),
}));

vi.mock('../lib/components/button', () => ({
    Button: ({
        text,
        onClick,
        variant,
        size,
    }: {
        text: string;
        onClick: () => void;
        variant: string;
        size: string;
    }) => (
        <button
            data-testid={`button-${text}`}
            onClick={onClick}
            className={`button-${variant} button-${size}`}
        >
            {text}
        </button>
    ),
}));

describe('ReviewSnippet', () => {
    const baseProps: ReviewSnippetProps = {
        reviewText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        rating: 4,
        reviewerName: 'John Doe',
        reviewerAvatarUrl: 'https://example.com/avatar.jpg',
        locale: 'en',
    };
    it('renders short review without read more button', () => {
        render(<ReviewSnippet {...baseProps} />);
        expect(
            screen.getByText(
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            ),
        ).toBeInTheDocument();
        expect(screen.queryByText('Read more')).not.toBeInTheDocument();
    });

    it('renders truncated long review with read more button', () => {
        const longText =
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.';
        render(<ReviewSnippet {...baseProps} reviewText={longText} />);

        expect(
            screen.getByText(
                (content) =>
                    content
                        .replace(/\s+/g, ' ')
                        .includes(longText.slice(0, 100)) &&
                    content.includes('...'),
            ),
        ).toBeInTheDocument();
    });

    it('expands and collapses long review text', () => {
        const longReviewText =
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.';
        render(<ReviewSnippet {...baseProps} reviewText={longReviewText} />);

        fireEvent.click(screen.getByText('Read more'));
        expect(
            screen.getByText((content) =>
                content.replace(/\s+/g, ' ').includes(longReviewText),
            ),
        ).toBeInTheDocument();
        fireEvent.click(screen.getByText('Read less'));
        expect(
            screen.getByText(
                (content) =>
                    content
                        .replace(/\s+/g, ' ')
                        .includes(longReviewText.slice(0, 100)) &&
                    content.includes('...'),
            ),
        ).toBeInTheDocument();
    });

    it('renders reviewer name and rating', () => {
        render(<ReviewSnippet {...baseProps} />);
        // Check that the reviewer line contains both 'by' and the reviewer's name
        expect(
            screen.getByText(
                (content) =>
                    content.includes('by') && content.includes('John Doe'),
            ),
        ).toBeInTheDocument();
        // Check the star rating content
        expect(screen.getByTestId('star-rating')).toHaveTextContent(
            'Rating: 4/5',
        );
    });
});
