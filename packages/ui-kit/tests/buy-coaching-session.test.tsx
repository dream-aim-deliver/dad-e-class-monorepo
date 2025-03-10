import { render, screen, fireEvent } from '@testing-library/react';
import {BuyCoachingSession} from '../lib/components/buy-coaching-session';
import { vi } from 'vitest';

vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: () => ({
    components: {
      buyCoachingSession: {
        title: 'Buy Coaching Sessions',
        description: 'Choose your coaching sessions.',
        minutes: 'min',
        total: 'Total',
        buttonText: 'Buy Now'
      }
    }
  }),
  isLocalAware: vi.fn()
}));

const mockCourses = [
  { id: '1', title: 'React Basics', price: 50, duration: 30, totalSessions: 1 },
  { id: '2', title: 'Advanced Next.js', price: 100, duration: 60, totalSessions: 2 },
];

describe('BuyCoachingSession Component', () => {
  test('renders component with courses', () => {
    render(<BuyCoachingSession onClick={vi.fn()} currencyType='CHF' courses={mockCourses} locale="en" />);

    expect(screen.getByText('Buy Coaching Sessions')).toBeInTheDocument();
    expect(screen.getByText('Choose your coaching sessions.')).toBeInTheDocument();
    expect(screen.getByText('React Basics')).toBeInTheDocument();
    expect(screen.getByText('Advanced Next.js')).toBeInTheDocument();
    expect(screen.getByText('50 CHF')).toBeInTheDocument();
    expect(screen.getByText('100 CHF')).toBeInTheDocument();
    expect(screen.getByText('Total: 250 CHF')).toBeInTheDocument();
  });

  test('increments and decrements session count', () => {
    render(<BuyCoachingSession onClick={vi.fn()} currencyType='CHF' courses={mockCourses} locale="en" />);

    const increaseButton = screen.getAllByLabelText('increase')[0];
    const decreaseButton = screen.getAllByLabelText('decrease')[0];
    const inputField = screen.getAllByRole('spinbutton')[0];

    // Check initial value
    expect(inputField).toHaveValue(1);

    // Increment
    fireEvent.click(increaseButton);
    expect(inputField).toHaveValue(2);

    // Decrement
    fireEvent.click(decreaseButton);
    expect(inputField).toHaveValue(1);
  });

  test('updates session count from input', () => {
    render(<BuyCoachingSession onClick={vi.fn()} currencyType='CHF' courses={mockCourses} locale="en" />);

    const inputField = screen.getAllByRole('spinbutton')[0];

    fireEvent.change(inputField, { target: { value: '5' } });
    expect(inputField).toHaveValue(5);
  });

  test('updates total cost correctly', () => {
    render(<BuyCoachingSession onClick={vi.fn()} currencyType='CHF' courses={mockCourses} locale="en" />);

    const increaseButton = screen.getAllByLabelText('increase')[0];

    fireEvent.click(increaseButton);
    
    expect(screen.getByText('Total: 300 CHF')).toBeInTheDocument();
  });
});