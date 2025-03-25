import { render, screen } from '@testing-library/react';
import { Hero } from '../lib/components/home-banner/hero';
import { vi } from 'vitest';

// Mock the VideoPlayer component
vi.mock('../lib/components/video-player', () => ({
  VideoPlayer: vi.fn(() => <div data-testid="mock-video-player" />),
}));

describe('Hero Component', () => {
  const mockProps = {
    title: 'Welcome to Our Platform',
    description: 'Learn from the best instructors around the world.',
    videoId: 'abc123xyz',
    thumbnailUrl: 'https://example.com/thumbnail.jpg',
  };

  it('renders the title correctly', () => {
    render(<Hero {...mockProps} />);
    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
  });

  it('renders the description correctly', () => {
    render(<Hero {...mockProps} />);
    expect(screen.getByText(mockProps.description)).toBeInTheDocument();
  });

  it('renders the VideoPlayer component', () => {
    render(<Hero {...mockProps} />);
    expect(screen.getByTestId('mock-video-player')).toBeInTheDocument();
  });

  it('applies correct CSS classes for title', () => {
    render(<Hero {...mockProps} />);
    const titleElement = screen.getByText(mockProps.title);
    expect(titleElement).toHaveClass('text-4xl text-text-primary font-bold leading-[100%] tracking-[-0.08rem]');
  });

  it('applies correct CSS classes for description', () => {
    render(<Hero {...mockProps} />);
    const descriptionElement = screen.getByText(mockProps.description);
    expect(descriptionElement).toHaveClass('text-lg text-text-secondary leading-[150%]');
  });
});
