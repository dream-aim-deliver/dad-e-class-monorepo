import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DateInput } from '../lib/components/date-input';

describe('<DateInput />', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    // Reset mocks between tests
    vi.clearAllMocks();
    // Mock the showPicker method which isn't available in the test environment
    HTMLInputElement.prototype.showPicker = vi.fn();
  });

  it('renders the date input with a label', () => {
    render(
      <DateInput
        label="Select Date"
        value="2025-02-18"
        onChange={mockOnChange}
        locale='en'
      />,
    );

    const container = screen.getByTestId('date-input-container');
    const label = screen.getByTestId('date-input-label');
    const input = screen.getByTestId('date-input-field');

    expect(container).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('Select Date');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'date');
    expect(input).toHaveValue('2025-02-18');
  });

  it('renders without a label when no label is provided', () => {
    render(<DateInput value="2025-02-18" onChange={mockOnChange} locale='en' />);

    const label = screen.queryByTestId('date-input-label');
    const input = screen.getByTestId('date-input-field');

    expect(label).not.toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  it('calls onChange when the date value changes', () => {
    render(
      <DateInput
        label="Select Date"
        value="2025-02-18"
        onChange={mockOnChange}
        locale='en'
      />,
    );

    const input = screen.getByTestId('date-input-field');
    fireEvent.change(input, { target: { value: '2025-03-01' } });

    expect(mockOnChange).toHaveBeenCalledWith('2025-03-01');
  });

  it('renders the custom calendar icon button', () => {
    render(
      <DateInput
        label="Select Date"
        value="2025-02-18"
        onChange={mockOnChange}
        locale='en'
      />,
    );

    const iconButton = screen.getByTestId('date-input-icon-button');
    expect(iconButton).toBeInTheDocument();
  });

  it('calls handleIconClick when the calendar icon is clicked', () => {
    const showPickerMock = vi.fn();
    HTMLInputElement.prototype.showPicker = showPickerMock;

    render(
      <DateInput
        label="Select Date"
        value="2025-02-18"
        onChange={mockOnChange}
        locale='en'
      />,
    );

    const iconButton = screen.getByTestId('date-input-icon-button');
    // Use stopPropagation option to simulate our component behavior
    fireEvent.click(iconButton, { stopPropagation: true });

    expect(showPickerMock).toHaveBeenCalledTimes(2);
  });

  it('calls showPicker when the input wrapper is clicked', () => {
    const showPickerMock = vi.fn();
    HTMLInputElement.prototype.showPicker = showPickerMock;

    render(
      <DateInput
        label="Select Date"
        value="2025-02-18"
        onChange={mockOnChange}
        locale='en'
      />,
    );

    const wrapper = screen.getByTestId('date-input-wrapper');
    fireEvent.click(wrapper);

    expect(showPickerMock).toHaveBeenCalledTimes(1);
  });
});