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
    locale: 'en' as TLocale,
    images: <img src="https://example.com/image.jpg" alt="Coaching on Demand" />,
  };

  it('renders title and description correctly', () => {
    render(<CoachingOnDemandBanner {...mockProps} />);

    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
    expect(screen.getByText(mockProps.description)).toBeInTheDocument();
  });
});
