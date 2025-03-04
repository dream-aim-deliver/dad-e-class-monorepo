import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FeedBackMessage } from '../lib/components/feedback-message';

vi.mock('../lib/components/icons/icon-error', () => ({
  IconError: ({ classNames }: { classNames: string }) => (
    <svg data-testid="icon-error" className={classNames} />
  ),
}));

vi.mock('../lib/components/icons/icon-success', () => ({
  IconSuccess: ({ classNames }: { classNames: string }) => (
    <svg data-testid="icon-success" className={classNames} />
  ),
}));

vi.mock('../lib/components/icons/icon-warning', () => ({
  IconWarning: ({ classNames }: { classNames: string }) => (
    <svg data-testid="icon-warning" className={classNames} />
  ),
}));

describe('<FeedBackMessage />', () => {
  it('renders the default error feedback message', () => {
    render(<FeedBackMessage />);
    const message = screen.getByText('Feedback Message');
    const icon = screen.getByTestId('icon-error');

    expect(message).toBeInTheDocument();
    expect(message).toHaveClass('text-feedback-error-primary');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('fill-feedback-error-primary');
  });

  it('renders a success feedback message with the correct icon and styles', () => {
    render(<FeedBackMessage type="success" message="Success Message" />);
    const message = screen.getByText('Success Message');
    const icon = screen.getByTestId('icon-success');

    expect(message).toBeInTheDocument();
    expect(message).toHaveClass('text-feedback-success-primary');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('fill-feedback-success-primary');
  });

  it('renders a warning feedback message with the correct icon and styles', () => {
    render(<FeedBackMessage type="warning" message="Warning Message" />);
    const message = screen.getByText('Warning Message');
    const icon = screen.getByTestId('icon-warning');

    expect(message).toBeInTheDocument();
    expect(message).toHaveClass('text-feedback-warning-primary');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('fill-feedback-warning-primary');
  });

  it('applies default values when no props are provided', () => {
    render(<FeedBackMessage />);
    const message = screen.getByText('Feedback Message');
    const icon = screen.getByTestId('icon-error');

    expect(message).toBeInTheDocument();
    expect(message).toHaveClass('text-feedback-error-primary');
    expect(icon).toBeInTheDocument();
  });
});
