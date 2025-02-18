import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Dropdown } from '../lib/components/dropdown';

describe('<Dropdown />', () => {
  const mockOnSelectionChange = vi.fn();

  const options = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];

  beforeEach(() => {
    mockOnSelectionChange.mockClear();
  });

  it('renders the dropdown button with default text for "simple" type', () => {
    render(
      <Dropdown
        type="simple"
        options={options}
        onSelectionChange={mockOnSelectionChange}
        text={{ simpleText: 'Select an option' }}
      />,
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Select an option');
  });

  it('opens and displays options when the dropdown button is clicked (simple type)', () => {
    render(
      <Dropdown
        type="simple"
        options={options}
        onSelectionChange={mockOnSelectionChange}
        text={{ simpleText: 'Select an option' }}
      />,
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    const optionItems = screen.getAllByRole('listitem');
    expect(optionItems).toHaveLength(options.length);
    expect(optionItems[0]).toHaveTextContent('Option 1');
  });

  it('selects an option and calls onSelectionChange (simple type)', () => {
    render(
      <Dropdown
        type="simple"
        options={options}
        onSelectionChange={mockOnSelectionChange}
        text={{ simpleText: 'Select an option' }}
      />,
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    const option = screen.getByText('Option 1');
    fireEvent.click(option);

    expect(mockOnSelectionChange).toHaveBeenCalledWith('option1');
    expect(button).toHaveTextContent('Option 1');
  });

  it('renders radio buttons for "choose-color" type and handles selection', () => {
    render(
      <Dropdown
        type="choose-color"
        options={options}
        onSelectionChange={mockOnSelectionChange}
        text={{ colorText: 'Choose a color' }}
      />,
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    const radioButtons = screen.getAllByRole('radio');
    expect(radioButtons).toHaveLength(options.length);

    fireEvent.click(radioButtons[1]);
    expect(mockOnSelectionChange).toHaveBeenCalledWith('option2');
  });

  it('renders checkboxes for "multiple-choice-and-search" type and handles multi-selection', () => {
    render(
      <Dropdown
        type="multiple-choice-and-search"
        options={options}
        onSelectionChange={mockOnSelectionChange}
        text={{ multiText: 'Select multiple options' }}
      />,
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(options.length);

    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[2]);

    expect(mockOnSelectionChange).toHaveBeenCalledWith(['option1', 'option3']);
  });

  it('filters options based on search query in "multiple-choice-and-search" type', () => {
    render(
      <Dropdown
        type="multiple-choice-and-search"
        options={options}
        onSelectionChange={mockOnSelectionChange}
        text={{ multiText: 'Select multiple options' }}
      />,
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'Option 2' } });

    const filteredOptions = screen.getAllByRole('checkbox');
    expect(filteredOptions).toHaveLength(1);
    expect(filteredOptions[0]).toHaveAttribute('value', 'option2');
  });

  it('closes the dropdown when clicking outside', () => {
    render(
      <Dropdown
        type="simple"
        options={options}
        onSelectionChange={mockOnSelectionChange}
        text={{ simpleText: 'Select an option' }}
      />,
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    let listItems = screen.queryAllByRole('listitem');
    expect(listItems).toHaveLength(options.length);

    fireEvent.mouseDown(document.body); // Simulate clicking outside
    listItems = screen.queryAllByRole('listitem');

    expect(listItems).toHaveLength(0); // Dropdown should be closed
  });
});
