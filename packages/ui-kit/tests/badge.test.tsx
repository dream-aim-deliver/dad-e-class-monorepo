import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Badge } from '../lib/components/badge';

describe('<Badge />', () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders the badge with default variant and size', () => {
    render(<Badge text="Default Badge" />);
    const badge = screen.getByText('Default Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-base-neutral-400 text-text-primary-inverted');
    expect(badge).toHaveClass('py-[2px] px-[4px] text-2xs rounded-small');
  });

  it('renders the badge with a custom variant', () => {
    render(<Badge text="Primary Badge" variant="primary" />);
    const badge = screen.getByText('Primary Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-action-default text-text-primary-inverted');
  });

  it('renders the badge with a custom size', () => {
    render(<Badge text="Big Badge" size="big" />);
    const badge = screen.getByText('Big Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('py-2 px-[8px] text-sm rounded-medium');
  });

  it('renders the badge with both custom variant and size', () => {
    render(<Badge text="Warning Badge" variant="warningprimary" size="big" />);
    const badge = screen.getByText('Warning Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass(
      'bg-feedback-warning-primary text-text-primary-inverted',
    ); // Variant: "warningprimary"
    expect(badge).toHaveClass('py-2 px-[8px] text-sm rounded-medium');
  });

  it('applies additional custom class names', () => {
    render(
      <Badge
        text="Custom Class Badge"
        className="custom-class another-class"
      />,
    );
    const badge = screen.getByText('Custom Class Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('custom-class another-class');
  });

  it('handles click events when onClick is provided', () => {
    render(<Badge text="Clickable Badge" onClick={mockOnClick} />);
    const badge = screen.getByText('Clickable Badge');

    fireEvent.click(badge);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("doesn't handle clicks when onClick is not provided", () => {
    render(<Badge text="Non-Clickable Badge" />);
    const badge = screen.getByText('Non-Clickable Badge');

    fireEvent.click(badge);

    expect(mockOnClick).not.toHaveBeenCalled();
  });
});
