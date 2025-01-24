import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FeedBackMessage } from '@/components/feedback-message';

describe('<FeedBackMessage />', () => {
  it('renders the feedback message with default props', () => {
    render(<FeedBackMessage />);
    const message = screen.getByText('Feedback Message');
    expect(message).toBeInTheDocument();
    expect(message).toHaveClass('text-feedback-error-primary');
  });

  it("renders the correct message for the 'error' type", () => {
    render(<FeedBackMessage type="error" message="Error occurred!" />);
    const message = screen.getByText('Error occurred!');
    expect(message).toBeInTheDocument();
    expect(message).toHaveClass('text-feedback-error-primary');
    const icon = screen.getByRole('img', { hidden: true });
    expect(icon).toHaveClass('fill-feedback-error-primary');
  });

  it("renders the correct message for the 'success' type", () => {
    render(<FeedBackMessage type="success" message="Operation successful!" />);
    const message = screen.getByText('Operation successful!');
    expect(message).toBeInTheDocument();
    expect(message).toHaveClass('text-feedback-success-primary');
    const icon = screen.getByRole('img', { hidden: true });
    expect(icon).toHaveClass('fill-feedback-success-primary');
  });

  it("renders the correct message for the 'warning' type", () => {
    render(<FeedBackMessage type="warning" message="This is a warning!" />);
    const message = screen.getByText('This is a warning!');
    expect(message).toBeInTheDocument();
    expect(message).toHaveClass('text-feedback-warning-primary');
    const icon = screen.getByRole('img', { hidden: true });
    expect(icon).toHaveClass('fill-feedback-warning-primary');
  });

  it('renders the correct SVG icon based on the type', () => {
    const { rerender } = render(<FeedBackMessage type="error" />);
    let icon = screen.getByRole('img', { hidden: true });
    expect(icon).toHaveClass('fill-feedback-error-primary');

    rerender(<FeedBackMessage type="success" />);
    icon = screen.getByRole('img', { hidden: true });
    expect(icon).toHaveClass('fill-feedback-success-primary');

    rerender(<FeedBackMessage type="warning" />);
    icon = screen.getByRole('img', { hidden: true });
    expect(icon).toHaveClass('fill-feedback-warning-primary');
  });

  it('applies the default message when none is provided', () => {
    render(<FeedBackMessage type="success" />);
    const message = screen.getByText('Feedback Message');
    expect(message).toBeInTheDocument();
  });
});
