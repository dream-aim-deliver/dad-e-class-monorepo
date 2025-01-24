import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { IconButton } from '@/components/icon-Button';

describe('<IconButton />', () => {
  const mockOnClick = vi.fn();

  it('renders a button with an icon', () => {
    render(<IconButton />);
    const button = screen.getByRole('button');
    const icon = screen.getByTestId('icon');

    expect(button).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
  });

  it('applies the correct default styles and size', () => {
    render(<IconButton />);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('w-[56px] h-[56px] rounded-big');
    expect(button).toHaveClass(
      'bg-button-primary-fill text-button-primary-text',
    );
  });

  it('renders the specified size', () => {
    render(<IconButton size="small" />);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('w-[32px] h-[32px] rounded-small');
  });

  it('renders the specified style', () => {
    render(<IconButton styles="secondary" />);
    const button = screen.getByRole('button');

    expect(button).toHaveClass(
      'bg-button-secondary-fill border-[1px] border-button-secondary-stroke',
    );
  });

  it('disables the button when the disabled prop is true', () => {
    render(<IconButton disabled onClick={mockOnClick} />);
    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50 cursor-not-allowed');

    fireEvent.click(button);
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('calls onClick when the button is clicked', () => {
    render(<IconButton onClick={mockOnClick} />);
    const button = screen.getByRole('button');

    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalled();
  });

  it('renders a custom icon when the icon prop is provided', () => {
    const CustomIcon = () => <svg data-testid="custom-icon" />;
    render(<IconButton icon={CustomIcon} />);
    const customIcon = screen.getByTestId('custom-icon');

    expect(customIcon).toBeInTheDocument();
  });

  it('applies additional className when provided', () => {
    render(<IconButton className="extra-class" />);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('extra-class');
  });
});
