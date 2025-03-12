import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StarRating } from '../lib/components/star-rating';

describe('<StarRating />', () => {
  it('renders the correct number of total stars', () => {
    render(<StarRating totalStars={5} rating={4.8} />);
    const stars = screen.getAllByRole('img');
    expect(stars.length).toBe(5);
  });

  it('renders the correct number of filled stars based on the rating', () => {
    render(<StarRating rating={3.6} totalStars={5} />);
    const filledStars = screen.getAllByRole('img', { name: 'filled star' });
    expect(filledStars.length).toBe(3);
  });

  it('renders a half star when the rating includes a fractional value', () => {
    render(<StarRating rating={3.6} totalStars={5} />);

    const halfStar = screen.getByRole('img', { name: 'half star' });
    expect(halfStar).toBeInTheDocument();
  });

  it('renders empty stars for remaining positions after filled and half stars', () => {
    render(<StarRating rating={3.6} totalStars={5} />);
    const emptyStars = screen.getByRole('img', { name: 'star' });
    expect(emptyStars).toBeInTheDocument();
  });
});