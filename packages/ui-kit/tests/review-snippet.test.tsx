import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ReviewSnippet, ReviewSnippetProps } from '../lib/components/review/review-snippet';

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
  StarRating: ({ rating, totalStars }: { rating: number; totalStars: number }) => (
    <div data-testid="star-rating">{`Rating: ${rating}/${totalStars}`}</div>
  ),
}));

vi.mock('../lib/components/avatar/user-avatar', () => ({
    UserAvatar: ({ fullName, size, imageUrl }: { fullName: string, size: string, imageUrl: string }) => (
        <img
        data-testid="user-avatar"
        src={imageUrl}
        alt={fullName}
        className={`avatar-${size}`}
        />
    ),
    }));

vi.mock('../lib/components/button', () => ({
    Button: ({ text, onClick, variant, size }: { text: string, onClick: () => void, variant: string, size: string }) => (
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
    reviewText: 'This is a short review.',
    rating: 4,
    reviewerName: 'John Doe',
    reviewerAvatarUrl: 'https://example.com/avatar.jpg',
    reviewerIsUser: false,
    locale: 'en',
  };
  it('renders short review without read more button', () => {
    render(<ReviewSnippet {...baseProps} />);
    expect(screen.getByText('"This is a short review."')).toBeInTheDocument();
    expect(screen.queryByText('Read more')).not.toBeInTheDocument();
  });

  it('renders truncanted long review with read more button', () => {
    const longText = 'This is a long review. '.repeat(10);
    render(<ReviewSnippet {...baseProps} reviewText={longText} />);

    expect(screen.getByText(`"${longText.slice(0, 100)}..."`)).toBeInTheDocument();
    expect(screen.getByText('Read more')).toBeInTheDocument();
  });

 it('expands and collapses long review text', () => {
    const longReviewText = 'This is a long review. '.repeat(10);
    render(<ReviewSnippet {...baseProps} reviewText={longReviewText} />);

    fireEvent.click(screen.getByText('Read more'));
    expect(screen.getByText(`"${longReviewText}"`)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Read less'));
    expect(screen.getByText(`"${longReviewText.slice(0, 100)}..."`)).toBeInTheDocument();
  });

  it('renders reviewer name and rating', () => {
    render(<ReviewSnippet {...baseProps} />);
    // Check that the reviewer line contains both 'by' and the reviewer's name
    expect(screen.getByText((content) => content.includes('by') && content.includes('John Doe'))).toBeInTheDocument();
    // Check the star rating content
    expect(screen.getByTestId('star-rating')).toHaveTextContent('Rating: 4/5');
  });
});
