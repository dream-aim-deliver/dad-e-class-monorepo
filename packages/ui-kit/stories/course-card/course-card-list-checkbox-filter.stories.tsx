import { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { CourseCard, CourseCardProps } from '../../lib/components/course-card/course-card';
import { CourseCardList, CourseCardListProps } from '../../lib/components/course-card/course-card-list';
import { TLocale } from '@maany_shr/e-class-translations';
import { CheckBox } from '../../lib/components/checkbox';

// Sample course data with alert callbacks
const sampleCourses: CourseCardProps[] = [
    {
        userType: 'visitor',
        reviewCount: 328,
        locale: 'en' as TLocale,
        language: { code: 'ENG', name: 'English' },
        course: {
            title: 'Advanced Brand Identity Design',
            description: 'Learn to create powerful brand identities.',
            duration: { video: 240, coaching: 120, selfStudy: 360 },
            pricing: { fullPrice: 299, partialPrice: 149, currency: 'USD' },
            imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
            author: { name: 'Emily Chen', image: 'https://example.com/author.jpg' },
            rating: 4.7,
        },
        sessions: 24,
        sales: 1850,
        onDetails: () => alert('View Details clicked for Advanced Brand Identity Design'),
        onBuy: () => alert('Buy Course clicked for Advanced Brand Identity Design'),
        onClickUser: () => alert('Author Emily Chen clicked'),
    },
    {
        userType: 'visitor',
        reviewCount: 156,
        locale: 'en' as TLocale,
        language: { code: 'ENG', name: 'English' },
        course: {
            title: 'Web Design Fundamentals',
            description: 'Master the basics of web design.',
            duration: { video: 180, coaching: 0, selfStudy: 240 },
            pricing: { fullPrice: 199, partialPrice: 99, currency: 'USD' },
            imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
            author: { name: 'Michael Brown', image: 'https://example.com/author2.jpg' },
            rating: 4.5,
        },
        sessions: 15,
        sales: 980,
        onDetails: () => alert('View Details clicked for Web Design Fundamentals'),
        onBuy: () => alert('Buy Course clicked for Web Design Fundamentals'),
        onClickUser: () => alert('Author Michael Brown clicked'),
    },
    {
        userType: 'visitor',
        reviewCount: 213,
        locale: 'en' as TLocale,
        language: { code: 'DEU', name: 'German' },
        course: {
            title: 'UI/UX Design Mastery',
            description: 'Become a pro in user-centered design.',
            duration: { video: 300, coaching: 180, selfStudy: 400 },
            pricing: { fullPrice: 349, partialPrice: 199, currency: 'USD' },
            imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
            author: { name: 'Sophia Rodriguez', image: 'https://example.com/author3.jpg' },
            rating: 4.8,
        },
        sessions: 30,
        sales: 1200,
        onDetails: () => alert('View Details clicked for UI/UX Design Mastery'),
        onBuy: () => alert('Buy Course clicked for UI/UX Design Mastery'),
        onClickUser: () => alert('Author Sophia Rodriguez clicked'),
    },
];


interface CourseCardListStoryProps extends CourseCardListProps {
    courses: CourseCardProps[];
}

// Storybook component wrapper
function CourseCardListStory({
    locale,
    emptyStateMessage,
    emptyStateButtonText,
    courses,
}: CourseCardListStoryProps) {
    const [includeCoaching, setIncludeCoaching] = useState(false);

    // Filter courses based on checkbox state
    const filteredCourses = includeCoaching
        ? courses.filter((course) => course.course?.duration.coaching > 0)
        : courses;

    // Update course locale dynamically
    const coursesWithLocale = filteredCourses.map((course) => ({
        ...course,
        locale,
    }));

    return (
        <div className="sm:w-full lg:w-4xl mx-auto">
            <div className="flex flex-col gap-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h3 className="text-text-primary text-2xl sm:text-3xl md:text-4xl lg:text-[40px]">
                        {locale === 'de' ? 'Unsere Kurse' : 'Our Courses'}
                    </h3>
                    <CheckBox
                        label={locale === 'de' ? 'Coaching enthalten' : 'Coaching Included'}
                        labelClass="text-text-primary text-sm sm:text-base md:text-lg leading-[100%]"
                        name="coaching-filter"
                        value="coaching-included"
                        withText={true}
                        checked={includeCoaching}
                        onChange={() => setIncludeCoaching(!includeCoaching)}
                    />
                </div>
                <CourseCardList
                    locale={locale}
                    emptyStateMessage={emptyStateMessage}
                    emptyStateButtonText={emptyStateButtonText}
                    onEmptyStateButtonClick={() => alert('Browse Courses clicked')}
                >
                    {coursesWithLocale.map((course, index) => (
                        <CourseCard key={`course-${index}`} {...course} />
                    ))}
                </CourseCardList>
            </div>
        </div>
    );
}

const meta: Meta<typeof CourseCardListStory> = {
    title: 'Components/CourseCardComponents/CourseCardListWithCheckboxFilter',
    component: CourseCardListStory,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        locale: {
            control: 'select',
            options: ['en', 'de'],
        },
        emptyStateMessage: { control: 'text' },
        emptyStateButtonText: { control: 'text' },
    },
};

export default meta;
type Story = StoryObj<typeof CourseCardListStory>;

export const Default: Story = {
    args: {
        locale: 'en',
        emptyStateMessage: 'No courses available',
        emptyStateButtonText: 'Browse Courses',
        courses: sampleCourses,
    },
};

export const CoursesWithCoachingIncluded: Story = {
    args: {
        locale: 'en',
        emptyStateMessage: 'No courses with coaching sessions available',
        emptyStateButtonText: 'Browse All Courses',
        courses: sampleCourses,
    },
    play: async ({ canvasElement }) => {
        const checkbox = canvasElement.querySelector('input[name="coaching-filter"]') as HTMLInputElement;
        checkbox.click();
    },
};

export const GermanLocale: Story = {
    args: {
        locale: 'de',
        emptyStateMessage: 'Keine Kurse verfügbar',
        emptyStateButtonText: 'Kurse durchsuchen',
        courses: sampleCourses,
    },
};

export const EmptyState: Story = {
    args: {
        locale: 'en',
        emptyStateMessage: 'No courses available',
        emptyStateButtonText: 'Browse Courses',
        courses: [],
    },
};

export const MobileView: Story = {
    args: {
        locale: 'en',
        emptyStateMessage: 'No courses available',
        emptyStateButtonText: 'Browse Courses',
        courses: sampleCourses,
    },
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
    },
};

export const TabletView: Story = {
    args: {
        locale: 'en',
        emptyStateMessage: 'No courses available',
        emptyStateButtonText: 'Browse Courses',
        courses: sampleCourses,
    },
    parameters: {
        viewport: {
            defaultViewport: 'tablet',
        },
    },
};