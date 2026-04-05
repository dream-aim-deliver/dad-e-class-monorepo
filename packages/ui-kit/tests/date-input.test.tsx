import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { DateInput } from '../lib/components/date-input';
import { Dialog, DialogContent } from '../lib/components/dialog';

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

  it('renders with default props blocking future dates', () => {
    const currentYear = new Date().getFullYear();

    render(
      <DateInput
        label="Birth Date"
        value=""
        onChange={mockOnChange}
        locale="en"
      />,
    );

    // Open calendar
    const wrapper = screen.getByTestId('date-input-wrapper');
    fireEvent.click(wrapper);

    expect(screen.getByTestId('date-input-calendar')).toBeInTheDocument();

    // The year dropdown should not contain years beyond the current year
    const calendarContainer = screen.getByTestId('date-input-calendar');
    const selects = calendarContainer.querySelectorAll('select');
    // Find the year dropdown (the one whose options contain 4-digit year values)
    let yearSelect: HTMLSelectElement | null = null;
    selects.forEach((sel) => {
      const options = Array.from(sel.options);
      if (options.some((opt) => /^\d{4}$/.test(opt.value))) {
        yearSelect = sel;
      }
    });

    expect(yearSelect).not.toBeNull();
    const yearOptions = Array.from(yearSelect!.options).map((opt) =>
      parseInt(opt.value, 10),
    );
    const maxYear = Math.max(...yearOptions);
    expect(maxYear).toBe(currentYear);
  });

  it('allows configuring endMonth for future dates', () => {
    const currentYear = new Date().getFullYear();
    const futureYear = currentYear + 10;

    render(
      <DateInput
        label="Expiration Date"
        value=""
        onChange={mockOnChange}
        locale="en"
        endMonth={new Date(futureYear, 11)}
        disabled={{ before: new Date() }}
      />,
    );

    // Open calendar
    const wrapper = screen.getByTestId('date-input-wrapper');
    fireEvent.click(wrapper);

    const calendarContainer = screen.getByTestId('date-input-calendar');
    const selects = calendarContainer.querySelectorAll('select');
    let yearSelect: HTMLSelectElement | null = null;
    selects.forEach((sel) => {
      const options = Array.from(sel.options);
      if (options.some((opt) => /^\d{4}$/.test(opt.value))) {
        yearSelect = sel;
      }
    });

    expect(yearSelect).not.toBeNull();
    const yearOptions = Array.from(yearSelect!.options).map((opt) =>
      parseInt(opt.value, 10),
    );
    expect(yearOptions).toContain(futureYear);
    expect(Math.max(...yearOptions)).toBe(futureYear);
  });

  it('allows selecting a future date when configured', () => {
    const currentYear = new Date().getFullYear();
    const futureYear = currentYear + 2;
    const targetMonth = 5; // June (0-indexed)
    const targetDay = 15;

    render(
      <DateInput
        label="Expiration Date"
        value=""
        onChange={mockOnChange}
        locale="en"
        endMonth={new Date(futureYear, 11)}
        disabled={{ before: new Date() }}
      />,
    );

    // Open calendar
    const wrapper = screen.getByTestId('date-input-wrapper');
    fireEvent.click(wrapper);

    const calendarContainer = screen.getByTestId('date-input-calendar');
    const selects = calendarContainer.querySelectorAll('select');

    // Find and change the year dropdown
    let yearSelect: HTMLSelectElement | null = null;
    let monthSelect: HTMLSelectElement | null = null;
    selects.forEach((sel) => {
      const options = Array.from(sel.options);
      if (options.some((opt) => /^\d{4}$/.test(opt.value))) {
        yearSelect = sel;
      } else {
        monthSelect = sel;
      }
    });

    expect(yearSelect).not.toBeNull();
    expect(monthSelect).not.toBeNull();

    // Navigate to the future year and month
    fireEvent.change(yearSelect!, { target: { value: String(futureYear) } });
    fireEvent.change(monthSelect!, { target: { value: String(targetMonth) } });

    // Find the target day cell via data-day attribute and click the button inside
    const expectedMonth = String(targetMonth + 1).padStart(2, '0');
    const expectedDate = `${futureYear}-${expectedMonth}-${targetDay}`;
    const dayCell = calendarContainer.querySelector(
      `[data-day="${expectedDate}"]`,
    );
    expect(dayCell).not.toBeNull();
    const targetButton = dayCell!.querySelector('button');
    expect(targetButton).not.toBeNull();
    fireEvent.click(targetButton!);

    // onChange should have been called with ISO date string
    expect(mockOnChange).toHaveBeenCalledWith(expectedDate);
  });

  it.each([2, 3, 5, 10])(
    'supports expiration dates %i years in the future',
    (yearsAhead) => {
      const currentYear = new Date().getFullYear();
      const futureYear = currentYear + yearsAhead;

      render(
        <DateInput
          label="Expiration Date"
          value=""
          onChange={mockOnChange}
          locale="en"
          endMonth={new Date(futureYear, 11)}
          disabled={{ before: new Date() }}
        />,
      );

      // Open calendar
      const wrapper = screen.getByTestId('date-input-wrapper');
      fireEvent.click(wrapper);

      const calendarContainer = screen.getByTestId('date-input-calendar');
      const selects = calendarContainer.querySelectorAll('select');
      let yearSelect: HTMLSelectElement | null = null;
      selects.forEach((sel) => {
        const options = Array.from(sel.options);
        if (options.some((opt) => /^\d{4}$/.test(opt.value))) {
          yearSelect = sel;
        }
      });

      expect(yearSelect).not.toBeNull();
      const yearOptions = Array.from(yearSelect!.options).map((opt) =>
        parseInt(opt.value, 10),
      );
      expect(yearOptions).toContain(futureYear);
    },
  );

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

  it('calendar portal z-index is higher than dialog z-index when used inside a dialog', () => {
    render(
      <Dialog defaultOpen={false} open={true} onOpenChange={() => { /* noop */ }}>
        <DialogContent showCloseButton closeOnOverlayClick closeOnEscape>
          <DateInput
            label="Select Date"
            value="2025-02-18"
            onChange={mockOnChange}
            locale="en"
            endMonth={new Date(2030, 11)}
            disabled={{ before: new Date(2020, 0) }}
          />
        </DialogContent>
      </Dialog>,
    );

    // Open calendar
    const wrapper = screen.getByTestId('date-input-wrapper');
    fireEvent.click(wrapper);

    const calendar = screen.getByTestId('date-input-calendar');
    expect(calendar).toBeInTheDocument();

    // Get z-index values
    const dialogPanel = screen.getByRole('dialog');
    const dialogZ = parseInt(dialogPanel.style.zIndex || '0', 10);

    const overlay = document.querySelector('.fixed.inset-0') as HTMLElement;
    const overlayZ = parseInt(overlay?.style.zIndex || '0', 10);

    const calendarZ = parseInt(calendar.style.zIndex || '0', 10);

    // Calendar must render ABOVE both dialog panel and overlay
    expect(calendarZ).toBeGreaterThan(dialogZ);
    expect(calendarZ).toBeGreaterThan(overlayZ);
  });

  it('calendar is rendered as a portal (not inside the dialog panel DOM)', () => {
    render(
      <Dialog defaultOpen={false} open={true} onOpenChange={() => { /* noop */ }}>
        <DialogContent showCloseButton closeOnOverlayClick closeOnEscape>
          <DateInput
            label="Select Date"
            value="2025-02-18"
            onChange={mockOnChange}
            locale="en"
            endMonth={new Date(2030, 11)}
            disabled={{ before: new Date(2020, 0) }}
          />
        </DialogContent>
      </Dialog>,
    );

    // Open calendar
    const wrapper = screen.getByTestId('date-input-wrapper');
    fireEvent.click(wrapper);

    const calendar = screen.getByTestId('date-input-calendar');
    const dialogPanel = screen.getByRole('dialog');

    // Calendar should NOT be a descendant of the dialog panel
    // (it's portaled out so it's not clipped by overflow)
    expect(dialogPanel.contains(calendar)).toBe(false);
  });
});
