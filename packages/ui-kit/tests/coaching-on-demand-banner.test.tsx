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
    ImageUrls: [
      'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
      'https://invalid-url.com/image.png',
      'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
    ],
    locale: 'en' as TLocale,
  };

  it('renders title and description correctly', () => {
    render(<CoachingOnDemandBanner {...mockProps} />);

    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
    expect(screen.getByText(mockProps.description)).toBeInTheDocument();
  });

  it('renders images correctly', () => {
    render(<CoachingOnDemandBanner {...mockProps} />);

    const images = screen.getAllByRole('img');
    expect(images.length).toBe(3);
    expect(images[0]).toHaveAttribute('src', mockProps.ImageUrls[0]);
    expect(images[2]).toHaveAttribute('src', mockProps.ImageUrls[2]);
  });

  it('handles image errors gracefully', () => {
    render(<CoachingOnDemandBanner {...mockProps} />);

    const brokenImage = screen.getAllByRole('img')[1];
    fireEvent.error(brokenImage);

    const errorPlaceholder = screen.getByText(
      mockDictionary.components.coachingOnDemandBanner.noImageText,
    );
    expect(errorPlaceholder).toBeInTheDocument();
  });

  it('renders placeholder for missing images', () => {
    const propsWithMissingImages = {
      ...mockProps,
      ImageUrls: [],
    };

    render(<CoachingOnDemandBanner {...propsWithMissingImages} />);

    const placeholders = screen.queryByText(
      mockDictionary.components.coachingOnDemandBanner.noImageText,
    );
    expect(placeholders).not.toBeInTheDocument();
  });
});
