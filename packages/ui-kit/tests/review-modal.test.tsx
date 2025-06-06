import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ReviewModal } from '../lib/components/review/review-modal';

// Mock dependencies
vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: (locale: string) => ({
    components: {
      reviewModal: {
        coachingTitle: 'How would you rate this coach?',
        courseTitle: 'How would you rate this course?',
        yourReview: 'Your review',
        reviewPlaceholder: 'What did you think about the course? Any suggestion on how we can improve it?',
        checkboxText: 'Did you need more time?',
        sendReviewButton: 'Send review',
        skipButton: 'Skip',
        thankYouText: 'Thank you for your feedback!',
        closeButton: 'Close',
        errorState: 'An error occurred. Please try again.',
      },
    },
  }),
  isLocalAware: vi.fn(),
}));

vi.mock('../lib/components/button', () => ({
  Button: ({ text, onClick, className, disabled, variant, size }: any) => (
    <button
      data-testid={`button-${text}`}
      onClick={onClick}
      className={className}
      disabled={disabled}
    >
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
        data-testid="review-textarea"
        className={className}
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
    <button
      data-testid={dataTestid || 'icon-button'}
      onClick={onClick}
      className={className}
    >
      {icon}
    </button>
  ),
}));

vi.mock('../lib/components/icons/icon-close', () => ({
  IconClose: () => <span data-testid="icon-close">Close</span>,
}));

vi.mock('../lib/components/icons/icon-loader-spinner', () => ({
  IconLoaderSpinner: ({ classNames }: { classNames: string }) => (
    <span data-testid="icon-loader-spinner" className={classNames}>Spinner</span>
  ),
}));


describe('ReviewDialog', () => {
  const defaultProps = {
    locale: 'en' as const,
    onClose: vi.fn(),
    onSubmit: vi.fn(),
    onSkip: vi.fn(),
    isLoading: false,
    isError: false,
    modalType: 'coaching' as const,
  };

  it('disables submit button when form is invalid', () => {
    render(<ReviewModal {...defaultProps} />);
    const submitButton = screen.getByTestId('button-Send review');
    expect(submitButton).toBeDisabled();
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  it('toggles checkbox state correctly for coaching', async () => {
    render(<ReviewModal {...defaultProps} />);
    const checkbox = screen.getByTestId('checkbox').querySelector('input');
    if (!checkbox) throw new Error('Checkbox input not found');
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

  it('does not render checkbox for course modalType', () => {
    render(<ReviewModal {...defaultProps} modalType="course" />);
    expect(screen.queryByTestId('checkbox')).not.toBeInTheDocument();
  });

  it('does not submit form if review is empty and rating is not set', async () => {
    render(<ReviewModal {...defaultProps} />);
    const submitButton = screen.getByTestId('button-Send review');
    expect(submitButton).toBeDisabled();
    await act(async () => {
      fireEvent.click(submitButton);
    });
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  it('does not call onSubmit on mount', () => {
    render(<ReviewModal {...defaultProps} />);
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  it('displays loading spinner when isLoading is true', () => {
    render(<ReviewModal {...defaultProps} isLoading={true} />);
    expect(screen.getByTestId('icon-loader-spinner')).toBeInTheDocument();
    expect(screen.getByTestId('button-Send review')).toBeDisabled();
    expect(screen.getByTestId('button-Skip')).toBeDisabled();
  });

  it('displays error message when isError is true', () => {
    render(<ReviewModal {...defaultProps} isError={true} />);
    expect(screen.getByText('An error occurred. Please try again.')).toBeInTheDocument();
  });

  it('renders close button and triggers onClose', () => {
    render(<ReviewModal {...defaultProps} />);
    const closeButton = screen.getByTestId('icon-button');
    fireEvent.click(closeButton);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('shows correct title for coaching', () => {
    render(<ReviewModal {...defaultProps} modalType="coaching" />);
    expect(screen.getByText('How would you rate this coach?')).toBeInTheDocument();
  });

  it('shows correct title for course', () => {
    render(<ReviewModal {...defaultProps} modalType="course" />);
    expect(screen.getByText('How would you rate this course?')).toBeInTheDocument();
  });
});