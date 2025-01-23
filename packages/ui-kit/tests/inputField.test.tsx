import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { InputField, InputFieldProps } from '@/components/inputField';

describe('<InputField />', () => {
  const mockSetValue = vi.fn();

  const defaultProps: InputFieldProps = {
    value: '',
    setValue: mockSetValue,
  };

  it('renders an input field', () => {
    render(<InputField {...defaultProps} />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('displays placeholder text', () => {
    render(<InputField {...defaultProps} inputText="Enter text here" />);
    const input = screen.getByPlaceholderText('Enter text here');
    expect(input).toBeInTheDocument();
  });

  it('updates value on change', () => {
    render(<InputField {...defaultProps} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Hello' } });
    expect(mockSetValue).toHaveBeenCalledWith('Hello');
  });

  it('renders left content when `hasLeftContent` is true', () => {
    render(
      <InputField
        {...defaultProps}
        hasLeftContent
        leftContent={<span>Left</span>}
      />,
    );
    const leftContent = screen.getByText('Left');
    expect(leftContent).toBeInTheDocument();
  });

  it('renders right content when `hasRightContent` is true', () => {
    render(
      <InputField
        {...defaultProps}
        hasRightContent
        rightContnet={<span>Right</span>}
      />,
    );
    const rightContent = screen.getByText('Right');
    expect(rightContent).toBeInTheDocument();
  });
});
