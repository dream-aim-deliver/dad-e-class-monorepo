import { render, screen, waitFor, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GeneralCard } from '../lib/components/carousel/general-card';

// Mock the dependencies
vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: (locale: string) => ({
    components: {
      generalCard: {
        placeHolderText: 'Image not available',
      },
    },
  }),
  isLocalAware: vi.fn(),
}));

vi.mock('../button', () => ({
  Button: ({ text, className, onClick }: { text: string; className: string; onClick: () => void }) => (
    <button className={className} onClick={onClick}>
      {text}
    </button>
  ),
}));

vi.mock('../badge', () => ({
  Badge: ({ text }: { text: string }) => (
    <span>{text}</span>
  ),
}));

describe('GeneralCard', () => {
  const defaultProps = {
    imageUrl: 'https://example.com/image.jpg',
    title: 'Card Title',
    description: 'Card Description',
    buttonText: 'Click Me',
    locale: 'en' as 'en' | 'de',
    buttonCallback: vi.fn(),
    onButtonClick: vi.fn(),
  };

  it('renders title, description, and button text', () => {
    render(<GeneralCard {...defaultProps} />);

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument();
  });

  it('renders image with correct src and alt', () => {
    render(<GeneralCard {...defaultProps} />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
    expect(img).toHaveAttribute('alt', 'Card Title');
  });

  it('shows placeholder when image URL is empty', () => {
    render(<GeneralCard {...defaultProps} imageUrl="" />);

    expect(screen.getByText('Image not available')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('shows placeholder when image fails to load', async () => {
    render(<GeneralCard {...defaultProps} />);

    const img = screen.getByRole('img');
    img.dispatchEvent(new Event('error'));

    await waitFor(() => {
      expect(screen.getByText('Image not available')).toBeInTheDocument();
    });
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders badge when provided', () => {
    render(<GeneralCard {...defaultProps} badge="New" />);

    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('applies correct container classes', () => {
    const { container } = render(<GeneralCard {...defaultProps} />);

    const article = container.firstChild;
    expect(article).toHaveClass('flex', 'flex-col', 'h-auto', 'w-full', 'max-w-[382px]');

    const cardDiv = within(article as HTMLElement).getByRole('img').parentElement?.parentElement;
    expect(cardDiv).toHaveClass('rounded-lg', 'border', 'border-solid', 'bg-card-fill', 'border-card-stroke');
  });
});