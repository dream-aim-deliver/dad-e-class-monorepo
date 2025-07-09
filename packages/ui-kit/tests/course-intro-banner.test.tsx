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
    description: '[{"type": "paragraph", "children": [{"text": "A comprehensive course covering both frontend and backend technologies."}]}]',
    videoId: 'dQw4w9WgXcQ',
    thumbnailUrl: 'https://example.com/thumbnail.jpg',
    locale: 'en' as TLocale,
    onErrorCallback: vi.fn(),
  };

  it('renders the description correctly', () => {
    render(<CourseIntroBanner {...mockProps} />);
    expect(screen.getByText('A comprehensive course covering both frontend and backend technologies.')).toBeInTheDocument();
  });

  it('renders the VideoPlayer component', () => {
    render(<CourseIntroBanner {...mockProps} />);
    expect(screen.getByTestId('mock-video-player')).toBeInTheDocument();
  });
});
