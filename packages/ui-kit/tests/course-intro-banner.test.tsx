import { render, screen } from '@testing-library/react';
import {CourseIntroBanner} from '../lib/components/course-intro-banner';
import { vi } from 'vitest';
import { TLocale } from '@maany_shr/e-class-translations';

// Mock the VideoPlayer component
vi.mock('../lib/components/video-player', () => ({
  VideoPlayer: vi.fn(() => <div data-testid="mock-video-player" />),
}));

describe('CourseIntroBanner Component', () => {
  const mockProps = {
    title: 'Learn Full Stack Development',
    description: 'A comprehensive course covering both frontend and backend technologies.',
    videoId: 'dQw4w9WgXcQ',
    thumbnailUrl: 'https://example.com/thumbnail.jpg',
    locale: 'en' as TLocale,
    onErrorCallback: vi.fn(),
  };

  it('renders the title correctly', () => {
    render(<CourseIntroBanner {...mockProps} />);
    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
  });

  it('renders the description correctly', () => {
    render(<CourseIntroBanner {...mockProps} />);
    expect(screen.getByText(mockProps.description)).toBeInTheDocument();
  });

  it('renders the VideoPlayer component', () => {
    render(<CourseIntroBanner {...mockProps} />);
    expect(screen.getByTestId('mock-video-player')).toBeInTheDocument();
  });

  it('applies correct CSS classes for title', () => {
    render(<CourseIntroBanner {...mockProps} />);
    const titleElement = screen.getByText(mockProps.title);
    expect(titleElement).toHaveClass('text-3xl text-text-primary font-bold line-clamp-2');
  });

  it('applies correct CSS classes for description', () => {
    render(<CourseIntroBanner {...mockProps} />);
    const descriptionElement = screen.getByText(mockProps.description);
    expect(descriptionElement).toHaveClass('text-xl text-base-white');
  });
});
