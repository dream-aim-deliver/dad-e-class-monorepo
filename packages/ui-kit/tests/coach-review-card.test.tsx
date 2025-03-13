import { render, screen } from '@testing-library/react';
import ReviewCard from "../lib/components/coach-review-card";
import { vi } from 'vitest';

describe('ReviewCard Component', () => {
  test('renders review card with correct props', () => {
    render(
      <ReviewCard
        rating={4}
        reviewerName="John Doe"
        reviewerAvatar="/avatar.jpg"
        reviewText="This workshop was amazing!"
        workshopTitle="React Workshop"
        date="March 5, 2025"
        time="10:00 AM"
        courseTitle="Advanced React"
        courseImage="/course.jpg"
        locale='en'
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('This workshop was amazing!')).toBeInTheDocument();
    expect(screen.getByText('React Workshop')).toBeInTheDocument();
    expect(screen.getByText('March 5, 2025')).toBeInTheDocument();
    expect(screen.getByText('10:00 AM')).toBeInTheDocument();
    expect(screen.getByText('Advanced React')).toBeInTheDocument();
  });
});
