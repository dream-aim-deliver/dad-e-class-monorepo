import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { DateInput } from '../lib/components/date-input';

describe('<DateInput />', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
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
    expect(input).toHaveAttribute('type', 'text');
  });

  it('renders without a label when no label is provided', () => {
    render(<DateInput value="2025-02-18" onChange={mockOnChange} locale='en' />);

    const label = screen.queryByTestId('date-input-label');
    const input = screen.getByTestId('date-input-field');

    expect(label).not.toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  it('displays the formatted date value in the text input', () => {
    render(
      <DateInput
        label="Select Date"
        value="2025-02-18"
        onChange={mockOnChange}
        locale='en'
      />,
    );

    const input = screen.getByTestId('date-input-field') as HTMLInputElement;
    // The value should be a locale-formatted string (e.g., "2/18/2025" for en-US)
    expect(input.value).toBeTruthy();
    expect(input.value).not.toBe('');
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

  it('opens the calendar popover when the wrapper is clicked', () => {
    render(
      <DateInput
        label="Select Date"
        value="2025-02-18"
        onChange={mockOnChange}
        locale='en'
      />,
    );

    // Calendar should not be visible initially
    expect(screen.queryByTestId('date-input-calendar')).not.toBeInTheDocument();

    // Click the wrapper to open
    const wrapper = screen.getByTestId('date-input-wrapper');
    fireEvent.click(wrapper);

    // Calendar should now be visible
    expect(screen.getByTestId('date-input-calendar')).toBeInTheDocument();
  });

  it('opens the calendar popover when the icon button is clicked', () => {
    render(
      <DateInput
        label="Select Date"
        value="2025-02-18"
        onChange={mockOnChange}
        locale='en'
      />,
    );

    expect(screen.queryByTestId('date-input-calendar')).not.toBeInTheDocument();

    const iconButton = screen.getByTestId('date-input-icon-button');
    fireEvent.click(iconButton);

    expect(screen.getByTestId('date-input-calendar')).toBeInTheDocument();
  });

  it('closes the calendar when clicking outside', async () => {
    render(
      <div>
        <DateInput
          label="Select Date"
          value="2025-02-18"
          onChange={mockOnChange}
          locale='en'
        />
        <div data-testid="outside-element">Outside</div>
      </div>,
    );

    // Open calendar
    const wrapper = screen.getByTestId('date-input-wrapper');
    fireEvent.click(wrapper);
    expect(screen.getByTestId('date-input-calendar')).toBeInTheDocument();

    // Click outside
    await act(async () => {
      fireEvent.mouseDown(screen.getByTestId('outside-element'));
    });

    expect(screen.queryByTestId('date-input-calendar')).not.toBeInTheDocument();
  });

  it('displays placeholder text when no value is provided', () => {
    render(
      <DateInput
        label="Select Date"
        value=""
        onChange={mockOnChange}
        locale='en'
      />,
    );

    const input = screen.getByTestId('date-input-field') as HTMLInputElement;
    expect(input.value).toBe('');
    expect(input.placeholder).toBeTruthy();
  });
});
