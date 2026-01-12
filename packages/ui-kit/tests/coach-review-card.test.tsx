import { render, screen } from '@testing-library/react';
import { ReviewCard } from "../lib/components/review/coach-review-card";

describe('ReviewCard Component', () => {
  test('renders review card with correct props', () => {
    render(
      <ReviewCard
        type="with-course"
        rating={4}
        reviewerName="John Doe"
        reviewerAvatar="/avatar.jpg"
        reviewText="This workshop was amazing!"
        workshopTitle="React Workshop"
        date={new Date('2025-03-05')}
        time="10:00 AM"
        courseTitle="Advanced React"
        courseImage="/course.jpg"
        locale='en'
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('This workshop was amazing!')).toBeInTheDocument();
    expect(screen.getByText('React Workshop')).toBeInTheDocument();
    expect(screen.getByText('2025-03-05')).toBeInTheDocument();
    expect(screen.getByText('10:00 AM')).toBeInTheDocument();
    expect(screen.getByText('Advanced React')).toBeInTheDocument();
  });
});
