import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TextAreaInput } from '@/components/text-areaInput';

describe('<TextAreaInput />', () => {
  const mockSetValue = vi.fn();

  it('renders the component with a label', () => {
    render(
      <TextAreaInput
        label="Test Label"
        value=""
        setValue={mockSetValue}
        placeholder="Enter text here"
      />,
    );
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();

    const textarea = screen.getByPlaceholderText('Enter text here');
    expect(textarea).toBeInTheDocument();
  });

  it('renders the component without a label', () => {
    render(
      <TextAreaInput
        value=""
        setValue={mockSetValue}
        placeholder="Enter text here"
      />,
    );
    const textarea = screen.getByPlaceholderText('Enter text here');
    expect(textarea).toBeInTheDocument();

    const label = screen.queryByText('Test Label');
    expect(label).not.toBeInTheDocument();
  });

  it('calls setValue when the textarea value changes', () => {
    render(
      <TextAreaInput
        value=""
        setValue={mockSetValue}
        placeholder="Enter text here"
      />,
    );
    const textarea = screen.getByPlaceholderText('Enter text here');
    fireEvent.change(textarea, { target: { value: 'New Value' } });
    expect(mockSetValue).toHaveBeenCalledWith('New Value');
  });

  it('displays the correct value in the textarea', () => {
    render(
      <TextAreaInput
        value="Initial Value"
        setValue={mockSetValue}
        placeholder="Enter text here"
      />,
    );
    const textarea = screen.getByDisplayValue('Initial Value');
    expect(textarea).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <TextAreaInput
        value=""
        setValue={mockSetValue}
        placeholder="Enter text here"
        className="custom-class"
      />,
    );
    const textarea = screen.getByPlaceholderText('Enter text here');
    expect(textarea).toHaveClass('custom-class');
  });
});
