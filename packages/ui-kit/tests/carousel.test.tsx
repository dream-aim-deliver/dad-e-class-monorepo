import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Carousel } from '../lib/components/carousel/carousel';
import { GeneralCard } from '../lib/components/carousel/general-card';

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

vi.mock('../lib/components/carousel/general-card', () => ({
  GeneralCard: ({ title, description, buttonText, buttonUrl }: any) => (
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

describe('Carousel', () => {
  const defaultCards = [
      <GeneralCard
      key="card1"
      imageUrl="image1.jpg"
      title="Card 1"
      description="Description 1"
      buttonText="Click 1"
      buttonUrl="/card1"
      locale="en"
      onButtonClick={vi.fn()}
    />,
    <GeneralCard
      key="card2"
      imageUrl="image2.jpg"
      title="Card 2"
      description="Description 2"
      buttonText="Click 2"
      buttonUrl="/card2"
      locale="en"
      onButtonClick={vi.fn()}
    />,
    <GeneralCard
      key="card3"
      imageUrl="image3.jpg"
      title="Card 3"
      description="Description 3"
      buttonText="Click 3"
      buttonUrl="/card3"
      locale="en"
      onButtonClick={vi.fn()}
    />,
    <GeneralCard
      key="card4"
      imageUrl="image4.jpg"
      title="Card 4"
      description="Description 4"
      buttonText="Click 4"
      buttonUrl="/card4"
      locale="en"
      onButtonClick={vi.fn()}
    />,
  ];

  const defaultProps = {
    children: defaultCards,
    itemsPerView: 3,
    locale: 'en' as const,
    className: 'test-carousel',
  };

  it('renders nothing when children array is empty', () => {
    const { container } = render(<Carousel children={[]} locale="en" className='test-carousel' />);
    expect(container.firstChild).toBeNull();
  });

  it('renders initial group of children based on itemsPerView', async () => {
    render(<Carousel {...defaultProps} />);
    await vi.waitFor(() => {
      expect(screen.getByText('Card 1')).toBeInTheDocument();
      expect(screen.getByText('Card 2')).toBeInTheDocument();
      expect(screen.getByText('Card 3')).toBeInTheDocument();
      expect(screen.queryByText('Card 4')).not.toBeInTheDocument();
    });
  });

  it('navigates to next page when right arrow is clicked', async () => {
    render(<Carousel {...defaultProps} />);

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
    render(<Carousel {...defaultProps} />);

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

  it('renders pagination dots when there are multiple pages', () => {
    render(<Carousel {...defaultProps} />);
    const dots = screen.getAllByLabelText(/Go to page/);
    expect(dots).toHaveLength(2); // 4 items, 3 per view = 2 pages
  });

  it('navigates to specific page when pagination dot is clicked', async () => {
    render(<Carousel {...defaultProps} />);
    const dots = screen.getAllByLabelText(/Go to page/);
    fireEvent.click(dots[1]); // Go to page 2

    await vi.waitFor(() => {
      expect(screen.getByText('Card 4')).toBeInTheDocument();
      expect(screen.queryByText('Card 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Card 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Card 3')).not.toBeInTheDocument();
    }, { timeout: 500 });
  });

  it('handles touch swipe to next page', async () => {
    const { container } = render(<Carousel {...defaultProps} />);

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
    const { container } = render(<Carousel {...defaultProps} />);

    const carousel = container.querySelector('.overflow-hidden');
    if (carousel) {
      // Swipe to next page first
      fireEvent.touchStart(carousel, { touches: [{ clientX: 200 }] });
      fireEvent.touchMove(carousel, { touches: [{ clientX: 100 }] });

      // Swipe back to previous page
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

  it('adjusts items per view on window resize', async () => {
    const { rerender } = render(<Carousel {...defaultProps} />);

    // Initial state (3 items per view)
    await vi.waitFor(() => {
      const cards = screen.getAllByTestId('general-card');
      expect(cards).toHaveLength(3);
    });

    // Simulate tablet view (2 items per view)
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(800);
    fireEvent.resize(window);
    rerender(<Carousel {...defaultProps} />);

    await vi.waitFor(() => {
      const cards = screen.getAllByTestId('general-card');
      expect(cards).toHaveLength(2);
    }, { timeout: 200 });

    // Simulate mobile view (1 item per view)
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(500);
    fireEvent.resize(window);
    rerender(<Carousel {...defaultProps} />);

    await vi.waitFor(() => {
      const cards = screen.getAllByTestId('general-card');
      expect(cards).toHaveLength(1);
    }, { timeout: 200 });

    vi.restoreAllMocks();
  });
});