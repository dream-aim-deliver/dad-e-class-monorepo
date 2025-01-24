import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TextInput } from '@/components/text-input';

describe('<TextInput />', () => {
  const inputFieldProps = {
    value: '',
    setValue: vi.fn(),
    inputText: 'Enter your text',
    state: 'placeholder' as const,
  };

  const feedbackMessageProps = {
    type: 'error' as const,
    message: 'This is an error message',
  };

  it('renders the label correctly', () => {
    render(
      <TextInput
        label="Test Label"
        inputField={inputFieldProps}
        feedbackMessage={feedbackMessageProps}
      />,
    );
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass('text-text-secondary text-sm');
  });

  it('renders the input field with correct props', () => {
    render(
      <TextInput
        inputField={inputFieldProps}
        feedbackMessage={feedbackMessageProps}
      />,
    );
    const input = screen.getByPlaceholderText('Enter your text');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('value', '');
  });

  it('renders the feedback message when `hasFeedback` is true', () => {
    render(
      <TextInput
        inputField={inputFieldProps}
        feedbackMessage={feedbackMessageProps}
        hasFeedback={true}
      />,
    );
    const feedbackMessage = screen.getByText('This is an error message');
    expect(feedbackMessage).toBeInTheDocument();
    expect(feedbackMessage).toHaveClass('text-feedback-error-primary');
  });

  it('does not render the feedback message when `hasFeedback` is false', () => {
    render(
      <TextInput
        inputField={inputFieldProps}
        feedbackMessage={feedbackMessageProps}
        hasFeedback={false}
      />,
    );
    const feedbackMessage = screen.queryByText('This is an error message');
    expect(feedbackMessage).toBeNull();
  });

  it('applies default label when no label is provided', () => {
    render(
      <TextInput
        inputField={inputFieldProps}
        feedbackMessage={feedbackMessageProps}
      />,
    );
    const label = screen.getByText('label');
    expect(label).toBeInTheDocument();
  });

  it('passes the correct props to the input field', () => {
    render(
      <TextInput
        inputField={{ ...inputFieldProps, value: 'Test Value' }}
        feedbackMessage={feedbackMessageProps}
      />,
    );
    const input = screen.getByPlaceholderText('Enter your text');
    expect(input).toHaveAttribute('value', 'Test Value');
  });
});
