import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GeneralCardCarousel } from '../lib/components/carousel/general-card-carousel';

// Mock dependencies
vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: (locale: string) => ({
    components: {
      generalCard: {
        buttonText: 'Default CTA',
        placeHolderText: 'Image not available',
      },
    },
  }),
  isLocalAware: vi.fn(),
}));

vi.mock('../lib/components/button', () => ({
  Button: ({ text, onClick, className }: { text: string; onClick?: () => void; className?: string }) => (
    <button onClick={onClick} className={className}>
      {text}
    </button>
  ),
}));

// Updated GeneralCard mock to respect visibility
vi.mock('../lib/components/carousel/generalcard', () => ({
  default: ({ title, description, buttonText, buttonUrl }: any) => (
    <div data-testid="general-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <button onClick={() => (window.location.href = buttonUrl)}>{buttonText}</button>
    </div>
  ),
}));

vi.mock('../lib/components/icons/icon-chevron-left', () => ({
  IconChevronLeft: ({ classNames }: { classNames: string }) => (
    <span className={classNames}>Left</span>
  ),
}));

vi.mock('../lib/components/icons/icon-chevron-right', () => ({
  IconChevronRight: ({ classNames }: { classNames: string }) => (
    <span className={classNames}>Right</span>
  ),
}));

describe('GeneralCardCarousel', () => {
  const defaultCards = [
    {
      imageUrl: 'image1.jpg',
      title: 'Card 1',
      description: 'Description 1',
      buttonText: 'Click 1',
      buttonUrl: '/card1',
    },
    {
      imageUrl: 'image2.jpg',
      title: 'Card 2',
      description: 'Description 2',
      buttonText: 'Click 2',
      buttonUrl: '/card2',
    },
    {
      imageUrl: 'image3.jpg',
      title: 'Card 3',
      description: 'Description 3',
      buttonText: 'Click 3',
      buttonUrl: '/card3',
    },
    {
      imageUrl: 'image4.jpg',
      title: 'Card 4',
      description: 'Description 4',
      buttonText: 'Click 4',
      buttonUrl: '/card4',
    },
  ];

  const defaultProps = {
    cards: defaultCards,
    locale: 'en' as const,
  };

  it('renders nothing when cards array is empty', () => {
    const { container } = render(<GeneralCardCarousel cards={[]} locale="en" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders cards in the first group', async () => {
    render(<GeneralCardCarousel {...defaultProps} />);
    await vi.waitFor(() => {
      expect(screen.getByText('Card 1')).toBeInTheDocument();
      expect(screen.getByText('Card 2')).toBeInTheDocument();
      expect(screen.getByText('Card 3')).toBeInTheDocument();
      expect(screen.queryByText('Card 4')).not.toBeInTheDocument();
    });
  });

  it('navigates to next page when right arrow is clicked', async () => {
    render(<GeneralCardCarousel {...defaultProps} />);
    
    const rightButton = screen.getByLabelText('Next slide');
    fireEvent.click(rightButton);
    
    await vi.waitFor(() => {
      expect(screen.getByText('Card 4')).toBeInTheDocument();
      expect(screen.queryByText('Card 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Card 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Card 3')).not.toBeInTheDocument();
    }, { timeout: 500 });
  });

  it('navigates to previous page when left arrow is clicked', async () => {
    render(<GeneralCardCarousel {...defaultProps} />);
    
    const rightButton = screen.getByLabelText('Next slide');
    fireEvent.click(rightButton);
    
    const leftButton = screen.getByLabelText('Previous slide');
    fireEvent.click(leftButton);
    
    await vi.waitFor(() => {
      expect(screen.getByText('Card 1')).toBeInTheDocument();
      expect(screen.getByText('Card 2')).toBeInTheDocument();
      expect(screen.getByText('Card 3')).toBeInTheDocument();
      expect(screen.queryByText('Card 4')).not.toBeInTheDocument();
    }, { timeout: 500 });
  });

  it('renders default CTA button when no custom CTA is provided', () => {
    render(<GeneralCardCarousel {...defaultProps} />);
    expect(screen.getByText('Default CTA')).toBeInTheDocument();
  });

  it('renders pagination dots when there are multiple pages', () => {
    render(<GeneralCardCarousel {...defaultProps} />);
    const dots = screen.getAllByLabelText(/Go to page/);
    expect(dots).toHaveLength(2); // 4 cards, 3 per view = 2 pages
  });

  it('handles touch swipe to next page', async () => {
    const { container } = render(<GeneralCardCarousel {...defaultProps} />);
    
    const carousel = container.querySelector('.overflow-hidden');
    if (carousel) {
      fireEvent.touchStart(carousel, { touches: [{ clientX: 200 }] });
      fireEvent.touchMove(carousel, { touches: [{ clientX: 100 }] });
      
      await vi.waitFor(() => {
        expect(screen.getByText('Card 4')).toBeInTheDocument();
        expect(screen.queryByText('Card 1')).not.toBeInTheDocument();
        expect(screen.queryByText('Card 2')).not.toBeInTheDocument();
        expect(screen.queryByText('Card 3')).not.toBeInTheDocument();
      }, { timeout: 500 });
    }
  });

  it('handles touch swipe to previous page', async () => {
    const { container } = render(<GeneralCardCarousel {...defaultProps} />);
    
    const carousel = container.querySelector('.overflow-hidden');
    if (carousel) {
      fireEvent.touchStart(carousel, { touches: [{ clientX: 200 }] });
      fireEvent.touchMove(carousel, { touches: [{ clientX: 100 }] });
      
      fireEvent.touchStart(carousel, { touches: [{ clientX: 100 }] });
      fireEvent.touchMove(carousel, { touches: [{ clientX: 200 }] });
      
      await vi.waitFor(() => {
        expect(screen.getByText('Card 1')).toBeInTheDocument();
        expect(screen.getByText('Card 2')).toBeInTheDocument();
        expect(screen.getByText('Card 3')).toBeInTheDocument();
        expect(screen.queryByText('Card 4')).not.toBeInTheDocument();
      }, { timeout: 500 });
    }
  });

  it('adjusts cards per view on window resize', async () => {
    const { rerender } = render(<GeneralCardCarousel {...defaultProps} />);
    
    // Initial state (3 cards per view)
    await vi.waitFor(() => {
      const cards = screen.getAllByTestId('general-card');
      expect(cards).toHaveLength(3);
    });
    
    // Simulate tablet view (2 cards per view)
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(800);
    fireEvent.resize(window);
    rerender(<GeneralCardCarousel {...defaultProps} />);
    
    await vi.waitFor(() => {
      const cards = screen.getAllByTestId('general-card');
      expect(cards).toHaveLength(2);
    }, { timeout: 200 });
    
    // Simulate mobile view (1 card per view)
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(500);
    fireEvent.resize(window);
    rerender(<GeneralCardCarousel {...defaultProps} />);
    
    await vi.waitFor(() => {
      const cards = screen.getAllByTestId('general-card');
      expect(cards).toHaveLength(1);
    }, { timeout: 200 });
    
    vi.restoreAllMocks();
  });
});