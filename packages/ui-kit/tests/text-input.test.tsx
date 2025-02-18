import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TextInput } from '../lib/components/text-input';

vi.mock('../lib/components/input-field', () => ({
  InputField: ({ id }: { id: string }) => <input data-testid={id} />,
}));

vi.mock('../lib/components/feedback-message', () => ({
  FeedBackMessage: ({ type, message }: { type?: string; message?: string }) => (
    <div data-testid="feedback-message">
      <span>{type}</span>
      <p>{message}</p>
    </div>
  ),
}));

describe('<TextInput />', () => {
  it('renders the label and input field', () => {
    render(
      <TextInput
        label="Test Label"
        inputField={{ id: 'test-input', value: '', setValue: vi.fn() }}
      />,
    );

    const label = screen.getByText('Test Label');
    const input = screen.getByTestId('test-input');

    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'test-input');
    expect(input).toBeInTheDocument();
  });

  it('uses a generated ID if no ID is provided', () => {
    render(
      <TextInput
        label="Generated ID Label"
        inputField={{ value: '', setValue: vi.fn() }}
      />,
    );

    const label = screen.getByText('Generated ID Label');
    const input = screen.getByRole('textbox'); // Input without an explicit ID will still render
    const generatedId = label.getAttribute('for');

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(generatedId).toMatch(/^input-/); // Matches the generated ID pattern
  });

  it('renders feedback message when hasFeedback is true', () => {
    render(
      <TextInput
        label="Label with Feedback"
        hasFeedback={true}
        inputField={{ id: 'input-with-feedback', value: '', setValue: vi.fn() }}
        feedbackMessage={{ type: 'error', message: 'Error Message' }}
      />,
    );

    const feedback = screen.getByTestId('feedback-message');
    const feedbackType = screen.getByText('error');
    const feedbackMessage = screen.getByText('Error Message');

    expect(feedback).toBeInTheDocument();
    expect(feedbackType).toBeInTheDocument();
    expect(feedbackMessage).toBeInTheDocument();
  });

  it('does not render feedback message when hasFeedback is false', () => {
    render(
      <TextInput
        label="Label without Feedback"
        hasFeedback={false}
        inputField={{ id: 'input-no-feedback', value: '', setValue: vi.fn() }}
      />,
    );

    const feedback = screen.queryByTestId('feedback-message');

    expect(feedback).not.toBeInTheDocument();
  });

  it('passes props correctly to InputField component', () => {
    const mockSetValue = vi.fn();

    render(
      <TextInput
        label="Label with Props"
        inputField={{
          id: 'test-input',
          value: 'Test Value',
          setValue: mockSetValue,
          inputText: 'Placeholder Text',
          state: 'filling',
        }}
      />,
    );

    const input = screen.getByTestId('test-input');

    expect(input).toBeInTheDocument();
  });

  it('passes props correctly to FeedBackMessage component', () => {
    render(
      <TextInput
        label="Label with Feedback Props"
        hasFeedback={true}
        inputField={{ id: 'test-input', value: '', setValue: vi.fn() }}
        feedbackMessage={{ type: 'success', message: 'Success Message' }}
      />,
    );

    const feedbackType = screen.getByText('success');
    const feedbackMessage = screen.getByText('Success Message');

    expect(feedbackType).toBeInTheDocument();
    expect(feedbackMessage).toBeInTheDocument();
  });
});
