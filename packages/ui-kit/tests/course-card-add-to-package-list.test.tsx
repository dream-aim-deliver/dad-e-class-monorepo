import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CourseCardAddToPackageList } from '../lib/components/course-card/add-to-package/course-card-add-to-package-list';
import { ReactElement } from 'react';

// Mock translations
vi.mock('@maany_shr/e-class-translations', () => ({
    getDictionary: () => ({
        components: {
            courseCard: {
                includeCoursesTitle: 'Included Courses',
                includedCoursesCount: 'Included',
                emptyState: 'No courses included yet',
                allCoursesTitle: 'All Courses',
                searchCourse: 'Search',
                searchButton: 'Search',
                noFoundLabel: 'No results found',
            },
        },
    }),
    isLocalAware: vi.fn(),
}));

vi.mock('../lib/components/input-field', () => ({
    InputField: ({
        value,
        setValue,
    }: {
        value: string;
        setValue: (val: string) => void;
    }) => (
        <input
            data-testid="search-input"
            placeholder="Search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
    ),
}));

vi.mock('../lib/components/button', () => ({
    Button: ({ text, onClick }: { text: string; onClick: () => void }) => (
        <button data-testid={`button-${text}`} onClick={onClick}>
            {text}
        </button>
    ),
}));

vi.mock('../lib/components/banner', () => ({
    __esModule: true,
    default: ({ title }: { title: string }) => (
        <div data-testid="banner">{title}</div>
    ),
}));

interface MockCardProps {
    title: string;
    author: { name: string };
    courseAdded: boolean;
}

const MockCard = ({
    title,
    author,
    courseAdded,
}: MockCardProps): ReactElement => (
    <div>
        <span>{title}</span>
        <span>{author.name}</span>
        <span>{courseAdded ? 'Add' : 'Remove'}</span>
    </div>
);

describe('CourseCardAddToPackageList', () => {
    const courses: MockCardProps[] = [
        { title: 'Course A', author: { name: 'John' }, courseAdded: false },
        { title: 'Course B', author: { name: 'Jane' }, courseAdded: true },
        { title: 'React Course', author: { name: 'Ana' }, courseAdded: true },
    ];

    const renderWithChildren = () =>
        render(
            <CourseCardAddToPackageList locale="en" onSearch={vi.fn()}>
                {courses.map((course, index) => (
                    <MockCard
                        key={index}
                        title={course.title}
                        author={course.author}
                        courseAdded={course.courseAdded}
                    />
                ))}
            </CourseCardAddToPackageList>,
        );

    it('renders included and not-included courses correctly', () => {
        renderWithChildren();

        expect(screen.getByText('Included Courses')).toBeInTheDocument();
        expect(screen.getByText('Included (1)')).toBeInTheDocument();
        expect(screen.getByText('Course A')).toBeInTheDocument();
        expect(screen.getByText('All Courses')).toBeInTheDocument();
        expect(screen.getByText('Course B')).toBeInTheDocument();
        expect(screen.getByText('React Course')).toBeInTheDocument();
    });

    it('shows banner when no included courses', () => {
        render(
            <CourseCardAddToPackageList locale="en" onSearch={vi.fn()}>
                <MockCard
                    title="Course B"
                    author={{ name: 'Jane' }}
                    courseAdded={true}
                />
            </CourseCardAddToPackageList>,
        );

        expect(screen.getByTestId('banner')).toHaveTextContent(
            'No courses included yet',
        );
    });

    it('filters courses based on search input', () => {
        renderWithChildren();

        fireEvent.change(screen.getByTestId('search-input'), {
            target: { value: 'React' },
        });

        expect(screen.getByText('React Course')).toBeInTheDocument();
        expect(screen.queryByText('Course B')).not.toBeInTheDocument();
    });

    it('shows no results message when nothing matches search', () => {
        renderWithChildren();

        fireEvent.change(screen.getByTestId('search-input'), {
            target: { value: 'XYZ' },
        });

        expect(screen.getByText('No results found')).toBeInTheDocument();
    });
});
