import { render, screen } from '@testing-library/react';
import { LessonLinkItem } from '../lib/components/course-outline/lesson-link-item';
import { vi } from 'vitest';
import { TLocale } from '@maany_shr/e-class-translations';

const mockDictionary = {
  components: {
    courseOutline: {
      optionalText: 'Optional',
      updatedText: 'Updated',
    },
  },
};

vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: () => mockDictionary,
}));

describe('LessonLinkItem Component', () => {
  const defaultProps = {
    lessonTitle: 'Intro to Testing',
    lessonNumber: 1,
    isActive: false,
    locale: 'en' as TLocale,
  };

  it('renders the lesson title and number correctly', () => {
    render(<LessonLinkItem {...defaultProps} />);
    expect(screen.getByText('1.')).toBeInTheDocument();
    expect(screen.getByText('Intro to Testing')).toBeInTheDocument();
  });

  it('applies correct class when active', () => {
    const { container } = render(
      <LessonLinkItem {...defaultProps} isActive={true} />
    );
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs[0]).toHaveClass('text-action-default');
    expect(paragraphs[1]).toHaveClass('text-action-default');
    expect(paragraphs[1]).toHaveClass('font-bold');
  });

  it('renders check icon if lesson is completed', () => {
    const { container } = render(
      <LessonLinkItem {...defaultProps} isCompleted={true} />
    );
    const svgIcons = container.querySelectorAll('svg');
    expect(svgIcons.length).toBe(1);
    expect(svgIcons[0]).toHaveClass('text-feedback-success-primary');
  });

  it('renders optional and updated badges when applicable', () => {
    render(
      <LessonLinkItem
        {...defaultProps}
        isOptional={true}
        isUpdated={true}
      />
    );

    expect(screen.getByText('Optional')).toBeInTheDocument();
    expect(screen.getByText('Updated')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<LessonLinkItem {...defaultProps} onClick={handleClick} />);
    const item = screen.getByTestId('lesson-link-item');
    item.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not render check icon, optional, or updated when not provided', () => {
    const { container } = render(<LessonLinkItem {...defaultProps} />);
    expect(container.querySelectorAll('svg').length).toBe(0);
    expect(screen.queryByText('Optional')).not.toBeInTheDocument();
    expect(screen.queryByText('Updated')).not.toBeInTheDocument();
  });
});
