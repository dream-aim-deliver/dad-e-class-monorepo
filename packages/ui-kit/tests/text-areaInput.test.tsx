import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TextAreaInput } from '../lib/components/text-areaInput';

describe('<TextAreaInput />', () => {
  const mockSetValue = vi.fn();

  it('renders the label and textarea', () => {
    render(
      <TextAreaInput label="Test Label" value="" setValue={mockSetValue} />,
    );

    const label = screen.getByText('Test Label');
    const textarea = screen.getByRole('textbox');

    expect(label).toBeInTheDocument();
    expect(textarea).toBeInTheDocument();
  });

  it('does not render a label if none is provided', () => {
    render(<TextAreaInput value="" setValue={mockSetValue} />);

    const label = screen.queryByText('Test Label');
    const textarea = screen.getByRole('textbox');

    expect(label).not.toBeInTheDocument();
    expect(textarea).toBeInTheDocument();
  });

  it('displays the placeholder text', () => {
    render(
      <TextAreaInput
        placeholder="Enter your message"
        value=""
        setValue={mockSetValue}
      />,
    );

    const textarea = screen.getByPlaceholderText('Enter your message');
    expect(textarea).toBeInTheDocument();
  });

  it('uses the default placeholder text if none is provided', () => {
    render(<TextAreaInput value="" setValue={mockSetValue} />);

    const textarea = screen.getByPlaceholderText('');
    expect(textarea).toBeInTheDocument();
  });

  it('calls setValue when the textarea value changes', () => {
    render(<TextAreaInput value="" setValue={mockSetValue} />);

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'New Value' } });

    expect(mockSetValue).toHaveBeenCalledWith('New Value');
  });

  it('applies additional className styles', () => {
    render(
      <TextAreaInput
        value=""
        setValue={mockSetValue}
        className="custom-class"
      />,
    );

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('custom-class');
  });
});
