import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CouponSearchDropdown } from '../lib/components/coupon/coupon-search-dropdown';

describe('<CouponSearchDropdown />', () => {
  const mockOnSelectionChange = vi.fn();

  const options = [
    { label: 'Package Alpha', value: 'alpha' },
    { label: 'Package Beta', value: 'beta' },
    { label: 'Package Gamma', value: 'gamma' },
  ];

  beforeEach(() => {
    mockOnSelectionChange.mockClear();
  });

  // Rendering

  it('renders button with placeholder text (single mode)', () => {
    render(
      <CouponSearchDropdown
        mode="single"
        options={options}
        onSelectionChange={mockOnSelectionChange}
        placeholder="Select a package"
      />,
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Select a package');
  });

  it('renders button with placeholder text (multiple mode)', () => {
    render(
      <CouponSearchDropdown
        mode="multiple"
        options={options}
        onSelectionChange={mockOnSelectionChange}
        placeholder="Select packages"
      />,
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Select packages');
  });

  // Single mode data flow

  it('opens dropdown on click and shows all options as buttons', () => {
    render(
      <CouponSearchDropdown
        mode="single"
        options={options}
        onSelectionChange={mockOnSelectionChange}
        placeholder="Select a package"
      />,
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(options.length);
    options.forEach((opt) => {
      expect(screen.getByText(opt.label)).toBeInTheDocument();
    });
  });

  it('selecting an option calls onSelectionChange with the value string', () => {
    render(
      <CouponSearchDropdown
        mode="single"
        options={options}
        onSelectionChange={mockOnSelectionChange}
        placeholder="Select a package"
      />,
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);
    fireEvent.click(screen.getByText('Package Beta'));

    expect(mockOnSelectionChange).toHaveBeenCalledWith('beta');
  });

  it('selecting an option updates button text to selected label', () => {
    render(
      <CouponSearchDropdown
        mode="single"
        options={options}
        onSelectionChange={mockOnSelectionChange}
        placeholder="Select a package"
      />,
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);
    fireEvent.click(screen.getByText('Package Alpha'));

    expect(button).toHaveTextContent('Package Alpha');
  });

  it('selecting an option closes the dropdown', () => {
    render(
      <CouponSearchDropdown
        mode="single"
        options={options}
        onSelectionChange={mockOnSelectionChange}
        placeholder="Select a package"
      />,
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    let listItems = screen.queryAllByRole('listitem');
    expect(listItems).toHaveLength(options.length);

    fireEvent.click(screen.getByText('Package Alpha'));
    listItems = screen.queryAllByRole('listitem');
    expect(listItems).toHaveLength(0);
  });

  it('shows search input when open', () => {
    render(
      <CouponSearchDropdown
        mode="single"
        options={options}
        onSelectionChange={mockOnSelectionChange}
        placeholder="Select a package"
      />,
    );

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  // Multiple mode data flow

  it('opens dropdown on click and shows all options as checkboxes', () => {
    render(
      <CouponSearchDropdown
        mode="multiple"
        options={options}
        onSelectionChange={mockOnSelectionChange}
        placeholder="Select packages"
      />,
    );

    fireEvent.click(screen.getByRole('button'));

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(options.length);
  });

  it('toggling a checkbox calls onSelectionChange with array of selected values', () => {
    render(
      <CouponSearchDropdown
        mode="multiple"
        options={options}
        onSelectionChange={mockOnSelectionChange}
        placeholder="Select packages"
      />,
    );

    fireEvent.click(screen.getByRole('button'));

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    expect(mockOnSelectionChange).toHaveBeenCalledWith(['alpha']);
  });

  it('toggling multiple checkboxes accumulates selections', () => {
    render(
      <CouponSearchDropdown
        mode="multiple"
        options={options}
        onSelectionChange={mockOnSelectionChange}
        placeholder="Select packages"
      />,
    );

    fireEvent.click(screen.getByRole('button'));

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[2]);

    expect(mockOnSelectionChange).toHaveBeenLastCalledWith(['alpha', 'gamma']);
  });

  it('unchecking removes from selection array', () => {
    render(
      <CouponSearchDropdown
        mode="multiple"
        options={options}
        onSelectionChange={mockOnSelectionChange}
        placeholder="Select packages"
        defaultValue={['alpha', 'beta']}
      />,
    );

    fireEvent.click(screen.getByRole('button'));

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    expect(mockOnSelectionChange).toHaveBeenCalledWith(['beta']);
  });

  it('dropdown stays open after selection in multiple mode', () => {
    render(
      <CouponSearchDropdown
        mode="multiple"
        options={options}
        onSelectionChange={mockOnSelectionChange}
        placeholder="Select packages"
      />,
    );

    fireEvent.click(screen.getByRole('button'));

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    expect(screen.getAllByRole('checkbox')).toHaveLength(options.length);
  });

  // Search filtering

  it('typing in search filters options (single mode)', () => {
    render(
      <CouponSearchDropdown
        mode="single"
        options={options}
        onSelectionChange={mockOnSelectionChange}
        placeholder="Select a package"
      />,
    );

    fireEvent.click(screen.getByRole('button'));

    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'Beta' } });

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(1);
    expect(screen.getByText('Package Beta')).toBeInTheDocument();
  });

  it('typing in search filters options (multiple mode)', () => {
    render(
      <CouponSearchDropdown
        mode="multiple"
        options={options}
        onSelectionChange={mockOnSelectionChange}
        placeholder="Select packages"
      />,
    );

    fireEvent.click(screen.getByRole('button'));

    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'Gamma' } });

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(1);
  });

  it('shows "No results" when search matches nothing', () => {
    render(
      <CouponSearchDropdown
        mode="single"
        options={options}
        onSelectionChange={mockOnSelectionChange}
        placeholder="Select a package"
      />,
    );

    fireEvent.click(screen.getByRole('button'));

    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    expect(screen.getByText('No results')).toBeInTheDocument();
  });

  // Close behavior

  it('closes dropdown when clicking outside', () => {
    render(
      <CouponSearchDropdown
        mode="single"
        options={options}
        onSelectionChange={mockOnSelectionChange}
        placeholder="Select a package"
      />,
    );

    fireEvent.click(screen.getByRole('button'));

    let listItems = screen.queryAllByRole('listitem');
    expect(listItems).toHaveLength(options.length);

    fireEvent.mouseDown(document.body);
    listItems = screen.queryAllByRole('listitem');
    expect(listItems).toHaveLength(0);
  });

  it('search query resets when dropdown closes', () => {
    render(
      <CouponSearchDropdown
        mode="single"
        options={options}
        onSelectionChange={mockOnSelectionChange}
        placeholder="Select a package"
      />,
    );

    fireEvent.click(screen.getByRole('button'));
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'Beta' } });
    expect(screen.getAllByRole('listitem')).toHaveLength(1);

    fireEvent.mouseDown(document.body);

    fireEvent.click(screen.getByRole('button'));
    const newSearchInput = screen.getByPlaceholderText('Search...');
    expect(newSearchInput).toHaveValue('');
    expect(screen.getAllByRole('listitem')).toHaveLength(options.length);
  });

  // defaultValue

  it('single mode respects defaultValue — button shows correct label', () => {
    render(
      <CouponSearchDropdown
        mode="single"
        options={options}
        onSelectionChange={mockOnSelectionChange}
        placeholder="Select a package"
        defaultValue="gamma"
      />,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Package Gamma');
  });

  it('multiple mode respects defaultValue — checkboxes are pre-checked', () => {
    render(
      <CouponSearchDropdown
        mode="multiple"
        options={options}
        onSelectionChange={mockOnSelectionChange}
        placeholder="Select packages"
        defaultValue={['alpha', 'gamma']}
      />,
    );

    fireEvent.click(screen.getByRole('button'));

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
    expect(checkboxes[2]).toBeChecked();
  });
});
