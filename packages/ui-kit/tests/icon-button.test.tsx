import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { IconButton } from '../lib/components/icon-button';

describe('<IconButton />', () => {
  const mockOnClick = vi.fn();

  it('renders the button with default properties', () => {
    render(<IconButton />);
    const button = screen.getByRole('button');
    const icon = screen.getByTestId('icon');

    expect(button).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
  });

  it('renders the default icon when no icon is provided', () => {
    render(<IconButton />);
    const icon = screen.getByTestId('icon');

    // Ensure the default icon (RefreshCcw) is rendered
    expect(icon.querySelector('svg')).toBeInTheDocument();
  });

  it('renders a custom icon when provided', () => {
    render(<IconButton icon={<svg data-testid="custom-icon" />} />);
    const customIcon = screen.getByTestId('custom-icon');

    expect(customIcon).toBeInTheDocument();
  });

  it('applies the correct size classes based on the size prop', () => {
    render(<IconButton size="small" />);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('w-[32px] h-[32px] rounded-small');
  });

  it('applies the correct style classes based on the styles prop', () => {
    render(<IconButton styles="secondary" />);
    const button = screen.getByRole('button');

    // Check for secondary style class
    expect(button).toHaveClass(
      'bg-button-secondary-fill border-[1px] border-button-secondary-stroke',
    );
  });

  it('calls onClick when clicked and not disabled', () => {
    render(<IconButton onClick={mockOnClick} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    render(<IconButton disabled={true} onClick={mockOnClick} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('applies disabled styles when disabled is true', () => {
    render(<IconButton disabled={true} />);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('opacity-50 cursor-not-allowed');
  });

  it('applies additional className styles when provided', () => {
    render(<IconButton className="custom-class" />);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('custom-class');
  });
});
