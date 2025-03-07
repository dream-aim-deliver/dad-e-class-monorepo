import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProgressBar } from '../lib/components/progress-bar';

describe('<ProgressBar />', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders the progress bar with default values', () => {
    render(<ProgressBar />);
    const progressBar = screen.getByRole('progressbar', { hidden: true });
    expect(progressBar).toBeInTheDocument();
  });

  it('renders the progress bar with custom progress and totalProgress values', () => {
    render(<ProgressBar progress={50} totalProgress={200} />);
    const progressBar = screen.getByRole('progressbar', { hidden: true });
    expect(progressBar).toBeInTheDocument();
  });

  it('renders a slider when type is "slider"', () => {
    render(<ProgressBar type="slider" />);
    const slider = screen.getByRole('slider');
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute('type', 'range');
    expect(slider).toHaveValue('10');
  });

  it('updates the slider value when dragged', () => {
    render(<ProgressBar type="slider" onChange={mockOnChange} />);
    const slider = screen.getByRole('slider');

    fireEvent.change(slider, { target: { value: '30' } });

    expect(slider).toHaveValue('30');
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(30);
  });

  it('does not call onChange when type is "progress"', () => {
    render(<ProgressBar type="progress" onChange={mockOnChange} />);
    const progressBar = screen.getByRole('progressbar', { hidden: true });

    fireEvent.click(progressBar);

    expect(mockOnChange).not.toHaveBeenCalled();
  });
});
