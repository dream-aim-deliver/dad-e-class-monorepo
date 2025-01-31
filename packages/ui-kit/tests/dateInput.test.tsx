import { expect, describe, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DateInput } from '@/components/date-input';

const mockOnChange = vi.fn();

describe('<DateInput />', () => {
  it('renders the DateInput component with a label', () => {
    render(<DateInput label="Custom Label" value="" onChange={mockOnChange} />);

    const label = screen.getByText(/Custom Label/i);
    const input = screen.getByLabelText(/Custom Label/i);
    const iconButton = screen.getByRole('button');

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(iconButton).toBeInTheDocument();
  });

  it('displays the correct value in the input', () => {
    render(
      <DateInput
        label="Custom Label"
        value="2023-01-01"
        onChange={mockOnChange}
      />,
    );

    const input = screen.getByLabelText(/Custom Label/i);
    expect(input).toHaveValue('2023-01-01');
  });

  it('calls onChange when the input value changes', () => {
    render(<DateInput label="Custom Label" value="" onChange={mockOnChange} />);

    const input = screen.getByLabelText(/Custom Label/i);
    fireEvent.change(input, { target: { value: '2025-01-01' } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('2025-01-01');
  });

  it('triggers the date picker when the icon button is clicked', () => {
    render(<DateInput label="Custom Label" value="" onChange={mockOnChange} />);

    const input = screen.getByLabelText(/Custom Label/i) as HTMLInputElement;
    const iconButton = screen.getByRole('button');

    input.showPicker = vi.fn(); // Mock the showPicker function

    fireEvent.click(iconButton);
    expect(input.showPicker).toHaveBeenCalled();
  });
});
