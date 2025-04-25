import { render, screen, fireEvent } from '@testing-library/react';
import { CourseProgressBar } from '../lib/components/course-progress-bar';
import { vi } from 'vitest';

// Mock the getDictionary function
const mockDictionary = {
  components: {
    courseProgressBar: {
      progressText: 'Course Progress',
      resumeText: 'Resume',
    },
  },
};

// Mock the translation module
vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: () => mockDictionary,
  isLocalAware: {},
}));

describe('CourseProgressBar Component', () => {
  it('renders progress information correctly', () => {
    render(
      <CourseProgressBar
        percentage={65}
        onClickResume={() => console.log('Resume Clicked')}
        locale="en"
      />
    );

    expect(screen.getByText('Course Progress')).toBeInTheDocument();
    expect(screen.getByText('65%')).toBeInTheDocument();
    expect(screen.getByText('Resume')).toBeInTheDocument();
  });

  it('displays the correct progress percentage', () => {
    const { rerender } = render(
      <CourseProgressBar
        percentage={0}
        onClickResume={() => console.log('Resume Clicked')}
        locale="en"
      />
    );
    expect(screen.getByText('0%')).toBeInTheDocument();

    rerender(
      <CourseProgressBar
        percentage={100}
        onClickResume={() => console.log('Resume Clicked')}
        locale="en"
      />
    );
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('triggers onClickResume when clicked', () => {
    const mockResumeClick = vi.fn();
    render(
      <CourseProgressBar
        percentage={65}
        onClickResume={mockResumeClick}
        locale="en"
      />
    );

    const resumeButton = screen.getByText('Resume');
    fireEvent.click(resumeButton);
    expect(mockResumeClick).toHaveBeenCalledTimes(1);
  });
});
