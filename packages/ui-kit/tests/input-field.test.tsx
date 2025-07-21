import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InputField } from '../lib/components/input-field';

describe('<InputField />', () => {
  const mockSetValue = vi.fn();

  it('renders an input field element', () => {
    render(<InputField id="test-input" value="" setValue={mockSetValue} />);
    const input = screen.getByTestId('test-input');
    expect(input).toBeInTheDocument();
  });

  it('displays the placeholder text', () => {
    render(
      <InputField
        id="test-input"
        inputPlaceholder="Enter text here"
        value=""
        setValue={mockSetValue}
      />,
    );
    const input = screen.getByTestId('test-input');
    expect(input).toHaveAttribute('placeholder', 'Enter text here');
  });

  it('calls setValue when the input value changes', () => {
    render(<InputField id="test-input" value="" setValue={mockSetValue} />);
    const input = screen.getByTestId('test-input');
    fireEvent.change(input, { target: { value: 'new value' } });
    expect(mockSetValue).toHaveBeenCalledWith('new value');
  });

  it('renders left content when hasLeftContent is true', () => {
    render(
      <InputField
        id="test-input"
        hasLeftContent
        leftContent={<span>Left</span>}
        value=""
        setValue={mockSetValue}
      />,
    );
    const leftContent = screen.getByText('Left');
    expect(leftContent).toBeInTheDocument();
  });

  it('renders right content when hasRightContent is true', () => {
    render(
      <InputField
        id="test-input"
        hasRightContent
        rightContent={<span>Right</span>}
        value=""
        setValue={mockSetValue}
      />,
    );
    const rightContent = screen.getByText('Right');
    expect(rightContent).toBeInTheDocument();
  });

  it('applies the disabled state correctly', () => {
    render(
      <InputField
        id="test-input"
        state="disabled"
        value=""
        setValue={mockSetValue}
      />,
    );
    const input = screen.getByTestId('test-input');
    expect(input).toBeDisabled();
  });

  it('applies the correct styles based on the state prop', () => {
    render(
      <InputField
        id="test-input"
        state="error"
        value=""
        setValue={mockSetValue}
      />,
    );
    const container =
      screen.getByTestId('test-input').parentElement?.parentElement;
    expect(container).toHaveClass('border-feedback-error-primary');
  });

  it('handles focus and blur events to toggle border color', () => {
    render(
      <InputField
        id="test-input"
        state="placeholder"
        value=""
        setValue={mockSetValue}
      />,
    );
    const input = screen.getByTestId('test-input');

    // Focus event
    fireEvent.focus(input);
    const containerOnFocus = input.parentElement?.parentElement;
    expect(containerOnFocus).toHaveClass('border-base-neutral-400');

    // Blur event
    fireEvent.blur(input);
    const containerOnBlur = input.parentElement?.parentElement;
    expect(containerOnBlur).toHaveClass('border-input-stroke');
  });
});
