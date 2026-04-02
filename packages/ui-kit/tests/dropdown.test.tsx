import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Dropdown } from '../lib/components/dropdown';
import { Dialog, DialogContent } from '../lib/components/dialog';

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

    fireEvent.mouseDown(document.body);
    listItems = screen.queryAllByRole('listitem');

    expect(listItems).toHaveLength(0);
  });

  it('dropdown portal z-index is higher than dialog overlay and content z-index', () => {
    render(
      <Dialog defaultOpen={false} open={true} onOpenChange={() => {}}>
        <DialogContent showCloseButton closeOnOverlayClick closeOnEscape>
          <Dropdown
            type="simple"
            options={options}
            onSelectionChange={mockOnSelectionChange}
            text={{ simpleText: 'Select an option' }}
          />
        </DialogContent>
      </Dialog>,
    );

    // Open the dropdown — multiple buttons exist (close button + dropdown button)
    const buttons = screen.getAllByRole('button');
    const dropdownButton = buttons.find(
      (btn) => btn.textContent?.includes('Select an option'),
    )!;
    fireEvent.click(dropdownButton);

    // Find the dialog panel (role="dialog") and get its z-index
    const dialogPanel = screen.getByRole('dialog');
    const dialogZ = parseInt(dialogPanel.style.zIndex || '0', 10);

    // Find the overlay (fixed inset-0)
    const overlay = document.querySelector('.fixed.inset-0') as HTMLElement;
    const overlayClassMatch = overlay?.className.match(/z-\[(\d+)\]/);
    const overlayZ = overlayClassMatch ? parseInt(overlayClassMatch[1], 10) : 0;

    // Find the dropdown portal container — it's positioned fixed with a zIndex style
    const allFixedDivs = document.querySelectorAll('div[style]');
    let dropdownPortal: HTMLElement | null = null;
    allFixedDivs.forEach((div) => {
      const el = div as HTMLElement;
      if (el.style.position === 'fixed' && el.style.zIndex && el.querySelector('ul')) {
        dropdownPortal = el;
      }
    });

    expect(dropdownPortal).not.toBeNull();
    const dropdownZ = parseInt(dropdownPortal!.style.zIndex, 10);

    // Dropdown must render ABOVE both dialog overlay and dialog content
    expect(dropdownZ).toBeGreaterThan(dialogZ);
    expect(dropdownZ).toBeGreaterThan(overlayZ);
  });
});
