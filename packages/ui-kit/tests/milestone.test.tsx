import { render, screen } from '@testing-library/react';
import { Milestone } from '../lib/components/course-outline/milestone';
import { vi } from 'vitest';

const mockDictionary = {
  components: {
    milestone: {
      milestoneText: 'Milestone',
    },
  },
};

vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: () => mockDictionary,
}));

describe('Milestone Component', () => {
  it('renders incomplete milestone correctly', () => {
    const { container } = render(<Milestone completed={false} locale="en" />);

    // Verify text
    expect(screen.getByText('Milestone')).toBeInTheDocument();

    // Check milestone icon class
    const milestoneIcon = container.querySelector('svg');
    expect(milestoneIcon).toHaveClass('text-text-secondary');

    // Verify only one SVG icon is rendered (no check icon)
    const svgIcons = container.querySelectorAll('svg');
    expect(svgIcons.length).toBe(1);
  });

  it('renders completed milestone correctly', () => {
    const { container } = render(<Milestone completed={true} locale="en" />);

    // Get all SVG icons
    const svgIcons = container.querySelectorAll('svg');

    // First SVG = milestone icon
    expect(svgIcons[0]).toHaveClass('text-feedback-success-primary');

    // Second SVG = check icon
    expect(svgIcons.length).toBe(2);
    expect(svgIcons[1]).toHaveClass('text-feedback-success-primary');
  });

  it('maintains consistent structure between states', () => {
    const { rerender, getByRole } = render(<Milestone completed={false} locale="en" />);

    const container = getByRole('milestone-container');
    expect(container).toHaveClass('min-w-[13.5rem] h-[2rem]');
    expect(container.childNodes.length).toBe(2);

    rerender(<Milestone completed={true} locale="en" />);
    expect(container.childNodes.length).toBe(3);
  });
});
