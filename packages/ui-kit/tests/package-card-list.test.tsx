import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PackageCardList } from '../lib/components/packages/package-card-list';

// Mock the dependencies
vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: (locale: string) => ({
    components: {
      packages: {
        ourPackagesText: 'Our Packages',
      },
    },
  }),
  isLocalAware: vi.fn(),
}));

describe('PackageCardList', () => {
  const defaultProps = {
    locale: 'en' as 'en' | 'de',
    children: <div>Child Component</div>,
  };

  it('renders heading with correct text', () => {
    render(<PackageCardList {...defaultProps} />);

    expect(screen.getByText('Our Packages')).toBeInTheDocument();
  });

  it('renders children components', () => {
    render(<PackageCardList {...defaultProps} />);

    expect(screen.getByText('Child Component')).toBeInTheDocument();
  });

  it('applies correct container classes', () => {
    const { container } = render(<PackageCardList {...defaultProps} />);

    const cardListDiv = container.firstChild;
    expect(cardListDiv).toHaveClass('flex', 'flex-col', 'gap-[60px]');
  });

  it('renders wrapper for children with correct classes', () => {
    const { container } = render(<PackageCardList {...defaultProps} />);

    const childrenWrapper = container.querySelector('.flex-wrap');
    expect(childrenWrapper).toHaveClass('flex', 'gap-4', 'flex-wrap');
  });
});
