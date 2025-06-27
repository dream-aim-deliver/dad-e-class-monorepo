import { render, screen } from '@testing-library/react';
import { Hero } from '../lib/components/home-banner/hero';
import { vi } from 'vitest';
import { TLocale } from '@maany_shr/e-class-translations';

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
    locale: 'en' as TLocale,
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
});
