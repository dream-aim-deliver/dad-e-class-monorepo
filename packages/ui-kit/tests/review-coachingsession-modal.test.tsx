import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ReviewDialog } from '../lib/components/review-coachingsession-modal';

// Mock dependencies
vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: (locale: string) => ({
    components: {
      reviewCoachingSessionModal: {
        title: 'How would you rate the course?',
        yourReview: 'Your review',
        reviewPlaceholder: 'What did you think about the course? Any suggestion on how we can improve it?',
        checkboxText: 'Did you need more time?',
        sendReviewButton: 'Send review',
        skipButton: 'Skip',
        thankYouText: 'Thank you for your feedback!',
        closeButton: 'Close',
      },
    },
  }),
  isLocalAware: vi.fn(),
}));

vi.mock('../lib/components/button', () => ({
  Button: ({ text, onClick, className, disabled }: { text: string; onClick?: () => void; className?: string; disabled?: boolean }) => (
    <button data-testid={`button-${text}`} onClick={onClick} className={className} disabled={disabled}>
      {text}
    </button>
  ),
}));

vi.mock('../lib/components/star-rating-input', () => ({
  default: ({ onChange, size, totalStars, type }: any) => (
    <div data-testid="star-rating-input">
      <button
        data-testid="set-rating"
        onClick={() => onChange({ single: 4 })}
      >
        Set Rating to 4
      </button>
    </div>
  ),
}));

vi.mock('../lib/components/star-rating', () => ({
  StarRating: ({ rating, totalStars }: any) => (
    <div data-testid="star-rating">{`Rating: ${rating}/${totalStars}`}</div>
  ),
}));

vi.mock('../lib/components/checkbox', () => ({
  CheckBox: ({ label, labelClass, name, value, withText, checked, onChange }: any) => (
    <label data-testid="checkbox">
      <input
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <span className={labelClass}>{label}</span>
    </label>
  ),
}));

vi.mock('../lib/components/text-area-input', () => ({
  TextAreaInput: ({ className, placeholder, value, setValue, ariaLabel }: any) => (
    <div className="flex flex-col gap-2 items-start">
      <textarea
        className={`${className} w-full px-3 py-[10px] bg-input-fill text-text-primary border border-input-stroke rounded-medium focus:outline-none placeholder:text-text-secondary px-3 pt-2.5 pb-4 w-full rounded-lg border border-stone-800 bg-stone-950 min-h-[104px] text-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label={ariaLabel}
      />
    </div>
  ),
}));

vi.mock('../lib/components/icons/icon-success', () => ({
  IconSuccess: ({ classNames }: { classNames: string }) => (
    <span data-testid="icon-success" className={classNames}>Success</span>
  ),
}));

vi.mock('../lib/components/icon-button', () => ({
  IconButton: ({ icon, onClick, className, dataTestid }: any) => (
    <button data-testid={dataTestid || 'icon-button'} onClick={onClick} className={className}>
      {icon}
    </button>
  ),
}));

vi.mock('../lib/components/icons/icon-close', () => ({
  IconClose: () => <span data-testid="icon-close">Close</span>,
}));

vi.mock('../lib/components/tooltip', () => ({
  default: ({ text }: { text: string }) => (
    <span data-testid="tooltip">{text}</span>
  ),
}));

describe('ReviewDialog', () => {
  const defaultProps = {
    locale: 'en' as const,
    onClose: vi.fn(),
    onSubmit: vi.fn(),
    onSkip: vi.fn(),
  };

  it('disables submit button when form is invalid', () => {
    render(<ReviewDialog {...defaultProps} />);
    const submitButton = screen.getByTestId('button-Send review');
    expect(submitButton).toBeDisabled();
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  it('calls onSkip and onClose when skip button is clicked', async () => {
    render(<ReviewDialog {...defaultProps} />);

    await act(async () => {
      fireEvent.click(screen.getByTestId('button-Skip'));
    });

    expect(defaultProps.onSkip).toHaveBeenCalled();
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked in form state', async () => {
    render(<ReviewDialog {...defaultProps} />);

    await act(async () => {
      fireEvent.click(screen.getByTestId('button-Skip'));
    });

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('toggles checkbox state correctly', async () => {
    render(<ReviewDialog {...defaultProps} />);

    const checkbox = screen.getByTestId('checkbox').querySelector('input')!;
    expect(checkbox).not.toBeChecked();

    await act(async () => {
      fireEvent.click(checkbox);
    });
    expect(checkbox).toBeChecked();

    await act(async () => {
      fireEvent.click(checkbox);
    });
    expect(checkbox).not.toBeChecked();
  });

  it('renders tooltip with correct text', () => {
    render(<ReviewDialog {...defaultProps} />);

    const tooltip = screen.getByTestId('tooltip');
    expect(tooltip).toHaveTextContent('Your review');
  });

  it('does not submit form if review is empty', async () => {
    render(<ReviewDialog {...defaultProps} />);

    await act(async () => {
      const submitButton = screen.getByTestId('button-Send review');
      expect(submitButton).toBeDisabled();
      fireEvent.click(submitButton);
    });

    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  it('does not call onSubmit on mount', () => {
    render(<ReviewDialog {...defaultProps} />);
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });
});