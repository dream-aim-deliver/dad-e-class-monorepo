import { expect, describe, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DateInput } from '@/components/dateInput';

const mockOnChange = vi.fn();

describe('<DateInput />', () => {
  it('renders the DateInput component', () => {
    render(<DateInput value="" onChange={mockOnChange} />);

    const label = screen.getByText(/Date of birth \(optional\)/i);
    const input = screen.getByLabelText(/Date of birth \(optional\)/i);
    const iconButton = screen.getByRole('button');

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(iconButton).toBeInTheDocument();
  });

  it('displays the correct value in the input', () => {
    render(<DateInput value="2023-01-01" onChange={mockOnChange} />);

    const input = screen.getByLabelText(/Date of birth \(optional\)/i);
    expect(input).toHaveValue('2023-01-01');
  });

  it('calls onChange when the input value changes', () => {
    render(<DateInput value="" onChange={mockOnChange} />);

    const input = screen.getByLabelText(/Date of birth \(optional\)/i);
    fireEvent.change(input, { target: { value: '2025-01-01' } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('2025-01-01');
  });

  it('triggers the date picker when the icon button is clicked', () => {
    render(<DateInput value="" onChange={mockOnChange} />);

    const input = screen.getByLabelText(
      /Date of birth \(optional\)/i,
    ) as HTMLInputElement;
    const iconButton = screen.getByRole('button');

    input.showPicker = vi.fn(); // Mock showPicker function

    fireEvent.click(iconButton);
    expect(input.showPicker).toHaveBeenCalled();
  });
});
