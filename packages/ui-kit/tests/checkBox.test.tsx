import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CheckBox, CheckBoxProps } from '@/components/profile/checkbox';

describe('<CheckBox />', () => {
  const mockOnChange = vi.fn();

  const defaultProps: CheckBoxProps = {
    name: 'testCheckbox',
    value: 'testValue',
    label: 'Test Checkbox',
    checked: false,
    disabled: false,
    withText: true,
    size: 'medium',
    onChange: mockOnChange,
  };

  it('renders a checkbox element', () => {
    render(<CheckBox {...defaultProps} />);
    const checkbox = screen.getByRole('checkbox', { name: /test checkbox/i });
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it('renders the label text when withText is true', () => {
    render(<CheckBox {...defaultProps} />);
    const label = screen.getByText('Test Checkbox');
    expect(label).toBeInTheDocument();
  });

  it('renders the checkbox as checked when checked is true', () => {
    render(<CheckBox {...defaultProps} checked />);
    const checkbox = screen.getByRole('checkbox', { name: /test checkbox/i });
    expect(checkbox).toBeChecked();
  });

  it('disables the checkbox when disabled is true', () => {
    render(<CheckBox {...defaultProps} disabled />);
    const checkbox = screen.getByRole('checkbox', { name: /test checkbox/i });
    expect(checkbox).toBeDisabled();
  });

  it('calls onChange when the checkbox is clicked', () => {
    render(<CheckBox {...defaultProps} />);
    const checkbox = screen.getByRole('checkbox', { name: /test checkbox/i });
    fireEvent.click(checkbox);
    expect(mockOnChange).toHaveBeenCalledWith('testValue');
  });

  it('does not call onChange when the checkbox is disabled', () => {
    render(<CheckBox {...defaultProps} disabled />);
    const checkbox = screen.getByRole('checkbox', { name: /test checkbox/i });
    fireEvent.click(checkbox);
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('renders the checkmark icon when checked is true', () => {
    render(<CheckBox {...defaultProps} checked />);
    const checkIcon = screen.getByTestId('checked-icon');
    expect(checkIcon).toBeInTheDocument();
  });
});
