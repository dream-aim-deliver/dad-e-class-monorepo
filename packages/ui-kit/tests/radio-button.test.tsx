import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RadioButton } from '../lib/components/radio-button';

describe('<RadioButton />', () => {
  const mockOnChange = vi.fn();

  it('renders the radio button with default properties', () => {
    render(<RadioButton name="test-radio" value="test-value" />);

    const input = screen.getByRole('radio');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('name', 'test-radio');
    expect(input).toHaveAttribute('value', 'test-value');
    expect(input).not.toBeChecked();
  });

  it('renders the label when withText is true', () => {
    render(
      <RadioButton
        name="test-radio"
        value="test-value"
        label="Test Label"
        withText={true}
      />,
    );

    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
  });

  it('does not render the label when withText is false', () => {
    render(
      <RadioButton
        name="test-radio"
        value="test-value"
        label="Test Label"
        withText={false}
      />,
    );

    const label = screen.queryByText('Test Label');
    expect(label).not.toBeInTheDocument();
  });

  it('applies the correct size classes based on the size prop', () => {
    render(<RadioButton name="test-radio" value="test-value" size="large" />);

    const container = screen.getByRole('radio').nextSibling;
    expect(container).toHaveClass('w-[40px] h-[40px]');
  });

  it('calls onChange when clicked and not disabled', () => {
    render(
      <RadioButton
        name="test-radio"
        value="test-value"
        onChange={mockOnChange}
      />,
    );

    const input = screen.getByRole('radio');
    fireEvent.click(input);

    expect(mockOnChange).toHaveBeenCalledWith('test-value');
  });

  it('does not call onChange when disabled', () => {
    render(
      <RadioButton
        name="test-radio"
        value="test-value"
        disabled={true}
        onChange={mockOnChange}
      />,
    );

    const input = screen.getByRole('radio');
    fireEvent.click(input);

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('renders as checked when the checked prop is true', () => {
    render(<RadioButton name="test-radio" value="test-value" checked={true} />);

    const input = screen.getByRole('radio');
    expect(input).toBeChecked();
  });

  it('renders as unchecked when the checked prop is false', () => {
    render(
      <RadioButton name="test-radio" value="test-value" checked={false} />,
    );

    const input = screen.getByRole('radio');
    expect(input).not.toBeChecked();
  });

  it('applies disabled styles when disabled is true', () => {
    render(
      <RadioButton name="test-radio" value="test-value" disabled={true} />,
    );

    const container = screen.getByRole('radio').nextSibling;
    expect(container).toHaveClass('opacity-50 cursor-not-allowed');
  });

  it('applies custom label class when labelClass is provided', () => {
    render(
      <RadioButton
        name="test-radio"
        value="test-value"
        label="Custom Label"
        withText={true}
        labelClass="custom-label-class"
      />,
    );

    const label = screen.getByText('Custom Label');
    expect(label).toHaveClass('custom-label-class');
  });
});
