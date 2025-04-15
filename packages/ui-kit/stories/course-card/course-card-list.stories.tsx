import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { CourseCardList } from '../../lib/components/coursecard/course-card-list';
import { CourseCard, CourseCardProps } from '../../lib/components/coursecard/course-card';
import {CourseEmptyState} from '../../lib/components/coursecard/course-empty-state';

// Sample course data without id
const sampleCourses: Record<string, CourseCardProps[]> = {
    creator: [
        {
            course: {
                title: 'Advanced Brand Identity Design',
                description: 'Learn to create powerful brand identities.',
                duration: { video: 240, coaching: 120, selfStudy: 360 },
                pricing: { fullPrice: 299, partialPrice: 149, currency: 'USD' },
                imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
                author: { name: 'Emily Chen', image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg' },
                rating: 4.7,
            },
            userType: 'creator',
            locale: 'en',
            reviewCount: 328,
            language: { code: 'ENG', name: 'English' },
            creatorStatus: 'published',
            sessions: 24,
            sales: 1850,
            onEdit: () => window.alert('Edit: Advanced Brand Identity Design'),
            onManage: () => window.alert('Manage: Advanced Brand Identity Design'),
        },
        {
            course: {
                title: 'UI Design Fundamentals',
                description: 'Master UI design basics.',
                duration: { video: 180, coaching: 60, selfStudy: 240 },
                pricing: { fullPrice: 199, partialPrice: 99, currency: 'USD' },
                imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
                author: { name: 'Emily Chen', image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg' },
                rating: 0,
            },
            userType: 'creator',
            locale: 'en',
            reviewCount: 0,
            language: { code: 'ENG', name: 'English' },
            creatorStatus: 'draft',
            sessions: 15,
            sales: 0,
            onEdit: () => window.alert('Edit: UI Design Fundamentals'),
            onManage: () => window.alert('Manage: UI Design Fundamentals'),
        },
        {
            course: {
                title: 'Typography Mastery',
                description: 'Learn advanced typography techniques.',
                duration: { video: 200, coaching: 80, selfStudy: 300 },
                pricing: { fullPrice: 249, partialPrice: 129, currency: 'USD' },
                imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
                author: { name: 'Emily Chen', image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg' },
                rating: 0,
            },
            userType: 'creator',
            locale: 'en',
            reviewCount: 0,
            language: { code: 'ENG', name: 'English' },
            creatorStatus: 'under-review',
            sessions: 20,
            sales: 0,
            onEdit: () => window.alert('Edit: Typography Mastery'),
            onManage: () => window.alert('Manage: Typography Mastery'),
        },
    ],
    coach: [
        {
            course: {
                title: 'Advanced Brand Identity Design',
                description: 'Learn to create powerful brand identities.',
                duration: { video: 240, coaching: 120, selfStudy: 360 },
                imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
                author: { name: 'Emily Chen', image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg' },
                rating: 4.7,
            },
            userType: 'coach',
            locale: 'en',
            reviewCount: 328,
            language: { code: 'ENG', name: 'English' },
            sessions: 24,
            sales: 1850,
            groupName: 'Design Mastermind',
            onManage: () => window.alert('Manage: Advanced Brand Identity Design'),
        },
    ],
    student: [
        {
            course: {
                title: 'Advanced Brand Identity Design',
                description: 'Learn to create powerful brand identities.',
                duration: { video: 240, coaching: 120, selfStudy: 360 },
                imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
                author: { name: 'Emily Chen', image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg' },
                rating: 4.7,
            },
            userType: 'student',
            locale: 'en',
            reviewCount: 328,
            language: { code: 'ENG', name: 'English' },
            sessions: 24,
            sales: 1850,
            progress: 0,
            onBegin: () => window.alert('Begin: Advanced Brand Identity Design'),
            onDetails: () => window.alert('Details: Advanced Brand Identity Design'),
        },
        {
            course: {
                title: 'Web Design Fundamentals',
                description: 'Master the basics of web design.',
                duration: { video: 180, coaching: 60, selfStudy: 240 },
                imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
                author: { name: 'Emily Chen', image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg' },
                rating: 4.5,
            },
            userType: 'student',
            locale: 'en',
            reviewCount: 156,
            language: { code: 'ENG', name: 'English' },
            sessions: 15,
            sales: 980,
            progress: 46,
            onResume: () => window.alert('Resume: Web Design Fundamentals'),
            onDetails: () => window.alert('Details: Web Design Fundamentals'),
        },
        {
            course: {
                title: 'UI/UX Design Principles',
                description: 'Learn UI/UX design fundamentals.',
                duration: { video: 200, coaching: 80, selfStudy: 300 },
                imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
                author: { name: 'Emily Chen', image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg' },
                rating: 4.8,
            },
            userType: 'student',
            locale: 'en',
            reviewCount: 245,
            language: { code: 'ENG', name: 'English' },
            sessions: 20,
            sales: 1200,
            progress: 100,
            onReview: () => window.alert('Review: UI/UX Design Principles'),
            onDetails: () => window.alert('Details: UI/UX Design Principles'),
        },
    ],
    visitor: [
        {
            course: {
                title: 'Advanced Brand Identity Design',
                description: 'Learn to create powerful brand identities.',
                duration: { video: 240, coaching: 120, selfStudy: 360 },
                pricing: { fullPrice: 299, partialPrice: 149, currency: 'USD' },
                imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
                author: { name: 'Emily Chen', image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg' },
                rating: 4.7,
            },
            userType: 'visitor',
            locale: 'en',
            reviewCount: 328,
            language: { code: 'ENG', name: 'English' },
            sessions: 24,
            sales: 1850,
            onBuy: () => window.alert('Buy: Advanced Brand Identity Design'),
            onDetails: () => window.alert('Details: Advanced Brand Identity Design'),
        },
    ],
};

// Mock dictionary for en and de
const mockDictionary = {
    en: {
        components: {
            courseCard: {
                courseEmptyState: {
                    message: 'No courses available',
                    message2: 'You haven’t created any courses yet',
                    buttonText: 'Browse Courses',
                },
            },
        },
    },
    de: {
        components: {
            courseCard: {
                courseEmptyState: {
                    message: 'Keine Kurse verfügbar',
                    message2: 'Sie haben noch keine Kurse erstellt',
                    buttonText: 'Kurse durchsuchen',
                },
            },
        },
    },
};

// Mock getDictionary function
const getDictionary = (locale: 'en' | 'de') => mockDictionary[locale];

const meta: Meta<typeof CourseCardList> = {
    title: 'Components/CourseCardComponents/CourseList',
    component: CourseCardList,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        backgrounds: { default: 'light' },
    },
    argTypes: {
        locale: {
            control: 'select',
            options: ['en', 'de'],
            description: 'Locale for translations and formatting (English or German)',
        },
        onEmptyStateButtonClick: {
            action: 'clicked',
            description: 'Callback for the empty state button (used for student/visitor)',
        },
        children: {
            control: { disable: true },
            description: 'React nodes representing course cards',
        },
    },
};

export default meta;

type Story = StoryObj<typeof CourseCardList>;

// Interactive mixed list
export const Interactive: Story = {
    render: (args) => {
        const courses = [
            sampleCourses.creator[0],
            sampleCourses.student[1],
            sampleCourses.visitor[0],
        ];
        return (
            <CourseCardList {...args}>
                {courses.map((course) => (
                    <CourseCard
                        key={course.course!.title}
                        {...course}
                        locale={args.locale}
                    />
                ))}
            </CourseCardList>
        );
    },
    args: {
        locale: 'en',
        onEmptyStateButtonClick: () => window.alert('Browse Courses clicked'),
    },
    name: 'Interactive Mixed List',
    parameters: {
        docs: {
            description: {
                story: 'Interactive example showcasing a mix of creator, student, and visitor course cards with locale switching (English/German).',
            },
        },
    },
};

// Creator list
export const CreatorList: Story = {
    render: (args) => (
        <CourseCardList {...args}>
            {sampleCourses.creator.map((course) => (
                <CourseCard
                    key={course.course!.title}
                    {...course}
                    locale={args.locale}
                />
            ))}
        </CourseCardList>
    ),
    args: {
        locale: 'en',
    },
    name: 'Creator List',
    parameters: {
        docs: {
            description: {
                story: 'Displays courses for creators with states: Published, Draft, and Under Review.',
            },
        },
    },
};

// Creator empty state
export const CreatorEmpty: Story = {
    render: (args) => (
        <CourseCardList {...args}>
            <CourseEmptyState locale={args.locale} context="creator" />
        </CourseCardList>
    ),
    args: {
        locale: 'en',
    },
    name: 'Creator Empty State',
    parameters: {
        docs: {
            description: {
                story: 'Displays the empty state for creators with no button.',
            },
        },
    },
};

// Coach list
export const CoachList: Story = {
    render: (args) => (
        <CourseCardList {...args}>
            {sampleCourses.coach.map((course) => (
                <CourseCard
                    key={course.course!.title}
                    {...course}
                    locale={args.locale}
                />
            ))}
        </CourseCardList>
    ),
    args: {
        locale: 'en',
    },
    name: 'Coach List',
    parameters: {
        docs: {
            description: {
                story: 'Displays courses from a coach perspective with group information.',
            },
        },
    },
};

// Coach empty state
export const CoachEmpty: Story = {
    render: (args) => (
        <CourseCardList {...args}>
            <CourseEmptyState locale={args.locale} context="coach" />
        </CourseCardList>
    ),
    args: {
        locale: 'en',
    },
    name: 'Coach Empty State',
    parameters: {
        docs: {
            description: {
                story: 'Displays the empty state for coaches with no button.',
            },
        },
    },
};

// Student list
export const StudentList: Story = {
    render: (args) => (
        <CourseCardList {...args}>
            {sampleCourses.student.map((course) => (
                <CourseCard
                    key={course.course!.title}
                    {...course}
                    locale={args.locale}
                />
            ))}
        </CourseCardList>
    ),
    args: {
        locale: 'en',
        onEmptyStateButtonClick: () => window.alert('Browse Courses clicked'),
    },
    name: 'Student List',
    parameters: {
        docs: {
            description: {
                story: 'Displays courses for students with progress states: Not Started, In Progress, and Completed.',
            },
        },
    },
};

// Student empty state
export const StudentEmpty: Story = {
    render: (args) => (
        <CourseCardList {...args}>
            <CourseEmptyState
                locale={args.locale}
                context="student"
                onButtonClick={args.onEmptyStateButtonClick}
            />
        </CourseCardList>
    ),
    args: {
        locale: 'en',
        onEmptyStateButtonClick: () => window.alert('Browse Courses clicked'),
    },
    name: 'Student Empty State',
    parameters: {
        docs: {
            description: {
                story: 'Displays the empty state for students with a browse courses button.',
            },
        },
    },
};

// Visitor list
export const VisitorList: Story = {
    render: (args) => (
        <CourseCardList {...args}>
            {sampleCourses.visitor.map((course) => (
                <CourseCard
                    key={course.course!.title}
                    {...course}
                    locale={args.locale}
                />
            ))}
        </CourseCardList>
    ),
    args: {
        locale: 'en',
        onEmptyStateButtonClick: () => window.alert('Browse Courses clicked'),
    },
    name: 'Visitor List',
    parameters: {
        docs: {
            description: {
                story: 'Displays courses for visitors with purchase options.',
            },
        },
    },
};

// Visitor empty state
export const VisitorEmpty: Story = {
    render: (args) => (
        <CourseCardList {...args}>
            <CourseEmptyState
                locale={args.locale}
                context="visitor"
                onButtonClick={args.onEmptyStateButtonClick}
            />
        </CourseCardList>
    ),
    args: {
        locale: 'en',
        onEmptyStateButtonClick: () => window.alert('Browse Courses clicked'),
    },
    name: 'Visitor Empty State',
    parameters: {
        docs: {
            description: {
                story: 'Displays the empty state for visitors with a browse courses button.',
            },
        },
    },
};

// Coach mixed list
export const CoachMixedList: Story = {
    render: (args) => {
        const courses = [
            sampleCourses.coach[0],
            sampleCourses.coach[0],
            sampleCourses.coach[0],
            sampleCourses.coach[0],
            sampleCourses.coach[0],
            sampleCourses.student[1],
        ];
        return (
            <CourseCardList {...args}>
                {courses.map((course, index) => (
                    <CourseCard
                        key={`${course.course!.title}-${index}`}
                        {...course}
                        locale={args.locale}
                    />
                ))}
            </CourseCardList>
        );
    },
    args: {
        locale: 'en',
        onEmptyStateButtonClick: () => window.alert('Browse Courses clicked'),
    },
    name: 'Coach Mixed List',
    parameters: {
        docs: {
            description: {
                story: 'Displays a list for a coach with five coach cards and one student card, as per the Figma design.',
            },
        },
    },
};