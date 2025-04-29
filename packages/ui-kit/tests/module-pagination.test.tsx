import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModulePagination } from '../lib/components/module-pagination';

describe('<ModulePagination />', () => {
  const mockOnPrevious = vi.fn();
  const mockOnNext = vi.fn();

  it('renders the pagination component', () => {
    render(<ModulePagination currentIndex={1} totalLessons={5} onPrevious={mockOnPrevious} onNext={mockOnNext} locale="en" />);
    const pagination = screen.getByText(/Lesson 2 \/ 5/);
    expect(pagination).toBeInTheDocument();
  });

  it('calls onPrevious when Previous button is clicked and enabled', () => {
    render(<ModulePagination currentIndex={1} totalLessons={5} onPrevious={mockOnPrevious} onNext={mockOnNext} locale='en'/>);
    const previousButton = screen.getByText('Previous');
    fireEvent.click(previousButton);
    expect(mockOnPrevious).toHaveBeenCalledTimes(1);
  });

  it('calls onNext when Next button is clicked and enabled', () => {
    render(<ModulePagination currentIndex={1} totalLessons={5} onPrevious={mockOnPrevious} onNext={mockOnNext} locale='en'/>);
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);
    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it('displays correct lesson number based on currentIndex and totalLessons', () => {
    render(<ModulePagination currentIndex={2} totalLessons={8} onPrevious={mockOnPrevious} onNext={mockOnNext} locale="en" />);
    const lessonText = screen.getByText('Lesson 3 / 8');
    expect(lessonText).toBeInTheDocument();
  });
});