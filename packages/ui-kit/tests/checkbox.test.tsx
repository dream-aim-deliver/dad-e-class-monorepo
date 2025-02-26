import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CheckBox } from '../lib/components/checkbox';

describe('<CheckBox />', () => {
  const mockOnChange = vi.fn();

  it('renders the checkbox with default properties', () => {
    render(<CheckBox name="test-checkbox" value="test-value" />);

    const input = screen.getByRole('checkbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('name', 'test-checkbox');
    expect(input).toHaveAttribute('value', 'test-value');
    expect(input).not.toBeChecked();
  });

  it('renders the label when withText is true', () => {
    render(
      <CheckBox
        name="test-checkbox"
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
      <CheckBox
        name="test-checkbox"
        value="test-value"
        label="Test Label"
        withText={false}
      />,
    );

    const label = screen.queryByText('Test Label');
    expect(label).not.toBeInTheDocument();
  });

  it('applies the correct size classes based on the size prop', () => {
    render(<CheckBox name="test-checkbox" value="test-value" size="large" />);

    const container = screen.getByRole('checkbox').nextSibling;
    expect(container).toHaveClass('w-[40px] h-[40px]');
  });

  it('renders as checked when the checked prop is true', () => {
    render(<CheckBox name="test-checkbox" value="test-value" checked={true} />);

    const input = screen.getByRole('checkbox');
    expect(input).toBeChecked();

    const checkedIcon = screen.getByTestId('checked-icon');
    expect(checkedIcon).toBeInTheDocument();
  });

  it('renders as unchecked when the checked prop is false', () => {
    render(
      <CheckBox name="test-checkbox" value="test-value" checked={false} />,
    );

    const input = screen.getByRole('checkbox');
    expect(input).not.toBeChecked();

    const checkedIcon = screen.queryByTestId('checked-icon');
    expect(checkedIcon).not.toBeInTheDocument();
  });

  it('calls onChange when clicked and not disabled', () => {
    render(
      <CheckBox
        name="test-checkbox"
        value="test-value"
        onChange={mockOnChange}
      />,
    );

    const input = screen.getByRole('checkbox');
    fireEvent.click(input);

    expect(mockOnChange).toHaveBeenCalledWith('test-value');
  });

  it('does not call onChange when disabled', () => {
    render(
      <CheckBox
        name="test-checkbox"
        value="test-value"
        disabled={true}
        onChange={mockOnChange}
      />,
    );

    const input = screen.getByRole('checkbox');
    fireEvent.click(input);

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('applies disabled styles when disabled is true', () => {
    render(
      <CheckBox name="test-checkbox" value="test-value" disabled={true} />,
    );

    const container = screen.getByRole('checkbox').nextSibling;
    expect(container).toHaveClass('opacity-50 cursor-not-allowed');
  });

  it('applies custom label class when labelClass is provided', () => {
    render(
      <CheckBox
        name="test-checkbox"
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
