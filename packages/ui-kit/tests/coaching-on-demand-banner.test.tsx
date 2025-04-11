import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { CoachingOnDemandBanner } from '../lib/components/coaching-on-demand-banner/coaching-on-demand-banner';
import { TLocale } from '@maany_shr/e-class-translations';

const mockDictionary = {
  components: {
    coachingOnDemandBanner: {
      noImageText: 'No image available',
    },
  },
};

vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: () => mockDictionary,
}));

describe('CoachingOnDemandBanner Component', () => {
  const mockProps = {
    title: 'Coaching on Demand',
    description:
      'Are you looking for someone to exchange ideas with on equal footing, or do you want to learn new skills? Our industry experts are ready to help you succeed.',
    desktopImageUrl: 'https://example.com/desktop.jpg',
    tabletImageUrl: 'https://example.com/tablet.jpg',
    mobileImageUrl: 'https://example.com/mobile.jpg',
    locale: 'en' as TLocale,
  };

  it('renders title and description correctly', () => {
    render(<CoachingOnDemandBanner {...mockProps} />);

    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
    expect(screen.getByText(mockProps.description)).toBeInTheDocument();
  });

  it('renders image correctly', () => {
    render(<CoachingOnDemandBanner {...mockProps} />);

    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockProps.desktopImageUrl);
  });

  it('handles image errors gracefully', () => {
    render(<CoachingOnDemandBanner {...mockProps} />);

    const image = screen.getByRole('img');
    fireEvent.error(image);

    const errorPlaceholder = screen.getByText(
      mockDictionary.components.coachingOnDemandBanner.noImageText
    );
    expect(errorPlaceholder).toBeInTheDocument();
  });

  it('renders placeholder for missing images', () => {
    const propsWithMissingImages = {
      ...mockProps,
      desktopImageUrl: '',
      tabletImageUrl: '',
      mobileImageUrl: '',
    };

    render(<CoachingOnDemandBanner {...propsWithMissingImages} />);

    const placeholder = screen.getByText(
      mockDictionary.components.coachingOnDemandBanner.noImageText
    );
    expect(placeholder).toBeInTheDocument();
  });

  it('uses correct image based on screen size', () => {
    const { rerender } = render(<CoachingOnDemandBanner {...mockProps} />);

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    fireEvent(window, new Event('resize'));

    let image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', mockProps.desktopImageUrl);

    Object.defineProperty(window, 'innerWidth', {
      value: 800,
    });
    fireEvent(window, new Event('resize'));
    rerender(<CoachingOnDemandBanner {...mockProps} />);

    image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', mockProps.tabletImageUrl);

    Object.defineProperty(window, 'innerWidth', {
      value: 500,
    });
    fireEvent(window, new Event('resize'));
    rerender(<CoachingOnDemandBanner {...mockProps} />);

    image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', mockProps.mobileImageUrl);
  });
});
