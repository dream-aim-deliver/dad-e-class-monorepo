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
            and: 'and',
            andLabel: 'and',
            other: 'other',
            others: 'others',
        },
        coachBanner: {
            placeHolderText: 'No image available',
        },
        userAvatarReel: {
            andLabel: 'and',
            otherLabel: 'other',
            othersLabel: 'others',
        },
    },
};

// Mock getDictionary
vi.mock('@maany_shr/e-class-translations', () => ({
    getDictionary: () => mockDictionary,
    isLocalAware: true,
}));

const mockStudents = [
    { name: 'Alice Smith', avatarUrl: 'https://example.com/avatar1.jpg' },
    { name: 'Bob Johnson', avatarUrl: 'https://example.com/avatar2.jpg' },
    { name: 'Charlie Brown', avatarUrl: 'https://example.com/avatar3.jpg' },
];

const baseProps = {
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
    progress: 65,
    showProgress: true,
    imageUrl: 'https://example.com/course.jpg',
    locale: 'en' as TLocale,
    onClickResume: vi.fn(),
    onClickAuthor: vi.fn(),
    students: mockStudents,
    totalStudentCount: 10,
};

describe('CourseGeneralInformationView', () => {
    it('renders all main course information', () => {
        render(<CourseGeneralInformationView {...baseProps} />);

        // expect(screen.getByText(baseProps.longDescription)).toBeInTheDocument();
        expect(screen.getByText('Total Duration')).toBeInTheDocument();
        expect(screen.getByText('6h 0m')).toBeInTheDocument();

        expect(screen.getByText('2 hours Video Material')).toBeInTheDocument();
        expect(
            screen.getByText('1 hour Coaching with a Professional'),
        ).toBeInTheDocument();
        expect(
            screen.getByText('3 hours Self Study Material'),
        ).toBeInTheDocument();

        expect(screen.getByText('Created by')).toBeInTheDocument();
        expect(screen.getByText('Dr. Emily Carter')).toBeInTheDocument();

        expect(screen.getByText('4.7')).toBeInTheDocument();

        // Progress section visible
        expect(screen.getByText('Your Progress')).toBeInTheDocument();
        expect(screen.getByText('65%')).toBeInTheDocument();
        expect(screen.getByText('Resume')).toBeInTheDocument();
    });

    it('renders placeholder when imageUrl is missing', () => {
        render(<CourseGeneralInformationView {...baseProps} imageUrl="" />);
        expect(screen.getByText('No image available')).toBeInTheDocument();
    });

    it('calls onClickAuthor when View Profile is clicked', () => {
        const onClickAuthor = vi.fn();
        render(
            <CourseGeneralInformationView
                {...baseProps}
                onClickAuthor={onClickAuthor}
            />,
        );
        fireEvent.click(screen.getByText('View Profile'));
        expect(onClickAuthor).toHaveBeenCalledTimes(1);
    });

    it('calls onClickResume when Resume is clicked', () => {
        const onClickResume = vi.fn();
        render(
            <CourseGeneralInformationView
                {...baseProps}
                onClickResume={onClickResume}
            />,
        );
        fireEvent.click(screen.getByText('Resume'));
        expect(onClickResume).toHaveBeenCalledTimes(1);
    });

    it('shows correct formatting for short durations', () => {
        render(
            <CourseGeneralInformationView
                {...baseProps}
                duration={{ video: 15, coaching: 0, selfStudy: 30 }}
            />,
        );
        expect(screen.getByText('45m')).toBeInTheDocument();
        expect(screen.getByText('15 min Video Material')).toBeInTheDocument();
        expect(
            screen.getByText('0 min Coaching with a Professional'),
        ).toBeInTheDocument();
        expect(
            screen.getByText('30 min Self Study Material'),
        ).toBeInTheDocument();
    });

    it('renders anonymous author correctly', () => {
        render(
            <CourseGeneralInformationView
                {...baseProps}
                author={{ name: 'Anonymous Instructor', image: '' }}
            />,
        );
        expect(screen.getByText('Anonymous Instructor')).toBeInTheDocument();
    });

    it('does not render progress section if showProgress is false', () => {
        render(
            <CourseGeneralInformationView
                {...baseProps}
                showProgress={false}
            />,
        );
        expect(screen.queryByText('Your Progress')).not.toBeInTheDocument();
        expect(screen.queryByText('Resume')).not.toBeInTheDocument();
    });
});
