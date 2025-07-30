import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { CourseGeneralInformationView } from '../lib/components/course-general-information/course-general-information-view';
import { TLocale } from '@maany_shr/e-class-translations';

// Mock translation dictionary
const mockDictionary = {
  components: {
    courseGeneralInformationView: {
      durationText: 'Total Duration',
      minutesText: 'min',
      hourText: 'hour',
      hoursText: 'hours',
      filmMaterialText: 'Video Material',
      coachingWithAProfessionalText: 'Coaching with a Professional',
      selfStudyMaterialText: 'Self Study Material',
      viewProfileText: 'View Profile',
      createdByText: 'Created by',
      yourProgressText: 'Your Progress',
      resumeText: 'Resume',
    },
    coachBanner: {
      placeHolderText: 'No image available',
    },
  },
};

// Mock getDictionary
vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: () => mockDictionary,
}));

const mockProps = {
  longDescription: 'This is a sample course description for testing.',
  duration: {
    video: 120,
    coaching: 60,
    selfStudy: 180,
  },
  author: {
    name: 'Dr. Emily Carter',
    image: 'https://example.com/avatar.jpg',
  },
  rating: 4.7,
  studentProgress: 65,
  imageUrl: 'https://example.com/course.jpg',
  locale: 'en' as TLocale,
};

describe('CourseGeneralInformationView', () => {
  it('renders all main course information', () => {
    render(<CourseGeneralInformationView {...mockProps} />);

    // Description
    expect(screen.getByText(mockProps.longDescription)).toBeInTheDocument();

    // Duration
    expect(screen.getByText('Total Duration')).toBeInTheDocument();
    expect(screen.getByText('6h 0m')).toBeInTheDocument(); // 120+60+180 = 360min = 6h 0m

    // Duration segments
    expect(screen.getByText('2 hours Video Material')).toBeInTheDocument();
    expect(screen.getByText('1 hour Coaching with a Professional')).toBeInTheDocument();
    expect(screen.getByText('3 hours Self Study Material')).toBeInTheDocument();

    // Author
    expect(screen.getByText('Created by')).toBeInTheDocument();
    expect(screen.getByText('Dr. Emily Carter')).toBeInTheDocument();

    // Rating
    expect(screen.getByText('4.7')).toBeInTheDocument();

    // Progress
    expect(screen.getByText('Your Progress')).toBeInTheDocument();
    expect(screen.getByText('65%')).toBeInTheDocument();

    // Resume button
    expect(screen.getByText('Resume')).toBeInTheDocument();
  });

  it('renders placeholder when imageUrl is missing', () => {
    render(<CourseGeneralInformationView {...mockProps} imageUrl="" />);
    expect(screen.getByText('No image available')).toBeInTheDocument();
  });

  it('calls onClickAuthor when View Profile is clicked', () => {
    const onClickAuthor = vi.fn();
    render(<CourseGeneralInformationView {...mockProps} onClickAuthor={onClickAuthor} />);
    const viewProfileBtn = screen.getByText('View Profile');
    fireEvent.click(viewProfileBtn);
    expect(onClickAuthor).toHaveBeenCalledTimes(1);
  });

  it('calls onClickResume when Resume is clicked', () => {
    const onClickResume = vi.fn();
    render(<CourseGeneralInformationView {...mockProps} onClickResume={onClickResume} />);
    const resumeBtn = screen.getByText('Resume');
    fireEvent.click(resumeBtn);
    expect(onClickResume).toHaveBeenCalledTimes(1);
  });

  it('renders children content', () => {
    render(
      <CourseGeneralInformationView {...mockProps}>
        <div data-testid="custom-children">Custom Children</div>
      </CourseGeneralInformationView>
    );
    expect(screen.getByTestId('custom-children')).toBeInTheDocument();
  });

  it('shows correct formatting for short durations', () => {
    render(
      <CourseGeneralInformationView
        {...mockProps}
        duration={{ video: 15, coaching: 0, selfStudy: 30 }}
      />
    );
    expect(screen.getByText('45m')).toBeInTheDocument(); // 15+0+30 = 45m
    expect(screen.getByText('15 min Video Material')).toBeInTheDocument();
    expect(screen.getByText('0 min Coaching with a Professional')).toBeInTheDocument();
    expect(screen.getByText('30 min Self Study Material')).toBeInTheDocument();
  });

  it('renders anonymous author correctly', () => {
    render(
      <CourseGeneralInformationView
        {...mockProps}
        author={{ name: 'Anonymous Instructor', image: '' }}
      />
    );
    expect(screen.getByText('Anonymous Instructor')).toBeInTheDocument();
  });
});
