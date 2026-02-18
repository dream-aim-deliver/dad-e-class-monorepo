import { Meta, StoryObj } from '@storybook/react-vite';
import {
    CourseModule,
    CourseOutlineAccordion,
} from '../../lib/components/course-outline-accordion';

const meta: Meta = {
    title: 'Components/CourseOutline/CourseOutlineAccordion',
    component: CourseOutlineAccordion,
    tags: ['docs'],
    parameters: {
        layout: 'centered',
    },
};

export default meta;

const courseModules: CourseModule[] = [
    {
        id: 1,
        title: 'Web Fundamentals',
        order: 1,
        completed: true,
        lessons: [
            {
                id: 101,
                title: 'HTML5 Essentials',
                order: 1,
                completed: true,
                updated: true,
            },
            {
                id: 102,
                title: 'CSS3 Styling Techniques',
                order: 2,
                completed: true,
            },
            {
                id: 103,
                title: 'Responsive Design Principles',
                order: 3,
                completed: true,
                optional: true,
            },
            {
                id: 104,
                title: 'JavaScript Basics',
                order: 4,
                completed: true,
                optional: true,
                updated: true,
            },
        ],
        milestones: [
            {
                id: 1001,
                precedingLessonId: 104,
                completed: true,
            },
        ],
    },
    {
        id: 2,
        title: 'Frontend Development',
        order: 2,
        completed: true,
        lessons: [
            {
                id: 201,
                title: 'React.js Fundamentals',
                order: 1,
                completed: true,
            },
            {
                id: 202,
                title: 'State Management with Redux',
                order: 2,
                completed: true,
            },
            {
                id: 203,
                title: 'React Router v6',
                order: 3,
                completed: true,
            },
        ],
        milestones: [
            {
                id: 2001,
                precedingLessonId: 0, // Module start milestone (no preceding lesson)
                completed: true,
            },
            {
                id: 2002,
                precedingLessonId: 203,
                completed: true,
            },
        ],
    },
    {
        id: 3,
        title: 'Backend Development',
        order: 3,
        lessons: [
            {
                id: 301,
                title: 'Node.js & Express Basics',
                order: 1,
                completed: true,
            },
            {
                id: 302,
                title: 'REST API Design',
                order: 2,
                completed: false,
            },
            {
                id: 303,
                title: 'Database Modeling with MongoDB',
                order: 3,
                completed: false,
                updated: true,
            },
            {
                id: 304,
                title: 'Authentication Strategies',
                order: 4,
                completed: false,
            },
        ],
        milestones: [
            {
                id: 3001,
                precedingLessonId: 304,
                completed: false,
            },
        ],
    },
    {
        id: 4,
        title: 'Advanced Concepts',
        order: 4,
        lessons: [
            {
                id: 401,
                title: 'GraphQL Implementation',
                order: 1,
                completed: false,
            },
            {
                id: 402,
                title: 'TypeScript for Full-Stack',
                order: 2,
                completed: false,
            },
            {
                id: 403,
                title: 'WebSockets & Real-time Features',
                order: 3,
                completed: false,
            },
        ],
        milestones: [],
    },
    {
        id: 5,
        title: 'Capstone Project',
        order: 5,
        lessons: [
            {
                id: 501,
                title: 'Project Planning & Architecture',
                order: 1,
                completed: false,
            },
            {
                id: 502,
                title: 'Agile Development Workflow',
                order: 2,
                completed: false,
            },
            {
                id: 503,
                title: 'Deployment Strategies',
                order: 3,
                completed: false,
            },
        ],
        milestones: [
            {
                id: 5001,
                precedingLessonId: 503,
                completed: false,
            },
        ],
    },
];

export const Default: StoryObj<typeof CourseOutlineAccordion> = {
    args: {
        locale: 'en',
        modules: courseModules,
        // activeLessonId: 101, // Example active lesson
        onLessonClick: (lessonId) => console.log('Lesson clicked:', lessonId),
    },
};

const unorderedCourseModules: CourseModule[] = [
    {
        id: 4,
        title: 'Advanced Concepts',
        order: 4,
        lessons: [
            {
                id: 404,
                title: 'Advanced Testing Strategies',
                order: 4,
                completed: false,
            },
            {
                id: 401,
                title: 'GraphQL Implementation',
                order: 1,
                completed: false,
            },
            {
                id: 405,
                title: 'Performance Optimization',
                order: 5,
                completed: false,
            },
            {
                id: 403,
                title: 'WebSockets & Real-time Features',
                order: 3,
                completed: false,
            },
            {
                id: 402,
                title: 'TypeScript for Full-Stack',
                order: 2,
                completed: false,
            },
        ],
        milestones: [
            {
                id: 4001,
                precedingLessonId: 402,
                completed: false,
            },
            {
                id: 4002,
                precedingLessonId: 405,
                completed: false,
            },
        ],
    },
    {
        id: 2,
        title: 'Frontend Development',
        order: 2,
        completed: true,
        lessons: [
            {
                id: 203,
                title: 'State Management with Redux',
                order: 3,
                completed: true,
            },
            {
                id: 205,
                title: 'Advanced React Patterns',
                order: 5,
                completed: true,
                optional: true,
            },
            {
                id: 201,
                title: 'React.js Fundamentals',
                order: 1,
                completed: true,
            },
            {
                id: 204,
                title: 'React Router v6',
                order: 4,
                completed: true,
            },
            {
                id: 202,
                title: 'Component Lifecycle & Hooks',
                order: 2,
                completed: true,
            },
        ],
        milestones: [
            {
                id: 2001,
                precedingLessonId: 0, // Module start milestone
                completed: true,
            },
            {
                id: 2002,
                precedingLessonId: 202,
                completed: true,
            },
            {
                id: 2003,
                precedingLessonId: 205,
                completed: true,
            },
        ],
    },
    {
        id: 7,
        title: 'DevOps & Deployment',
        order: 7,
        lessons: [
            {
                id: 702,
                title: 'Docker Containerization',
                order: 2,
                completed: false,
            },
            {
                id: 705,
                title: 'Monitoring & Logging',
                order: 5,
                completed: false,
            },
            {
                id: 701,
                title: 'CI/CD Pipelines with GitHub Actions',
                order: 1,
                completed: false,
            },
            {
                id: 704,
                title: 'Kubernetes Basics',
                order: 4,
                completed: false,
                optional: true,
            },
            {
                id: 703,
                title: 'AWS Deployment Strategies',
                order: 3,
                completed: false,
            },
        ],
        milestones: [
            {
                id: 7001,
                precedingLessonId: 702,
                completed: false,
            },
            {
                id: 7002,
                precedingLessonId: 705,
                completed: false,
            },
        ],
    },
    {
        id: 1,
        title: 'Web Fundamentals',
        order: 1,
        completed: true,
        lessons: [
            {
                id: 101,
                title: 'HTML5 Essentials',
                order: 1,
                completed: true,
                updated: true,
            },
            {
                id: 102,
                title: 'CSS3 Styling Techniques',
                order: 2,
                completed: true,
            },
            {
                id: 103,
                title: 'CSS Grid & Flexbox Mastery',
                order: 3,
                completed: true,
            },
            {
                id: 104,
                title: 'Responsive Design Principles',
                order: 4,
                completed: true,
                optional: true,
            },
            {
                id: 105,
                title: 'JavaScript Basics',
                order: 5,
                completed: true,
                optional: true,
                updated: true,
            },
            {
                id: 106,
                title: 'DOM Manipulation & Events',
                order: 6,
                completed: true,
            },
        ],
        milestones: [
            {
                id: 1001,
                precedingLessonId: 103,
                completed: true,
            },
            {
                id: 1002,
                precedingLessonId: 106,
                completed: true,
            },
        ],
    },
    {
        id: 6,
        title: 'Security & Authentication',
        order: 6,
        lessons: [
            {
                id: 601,
                title: 'Web Security Fundamentals',
                order: 1,
                completed: false,
            },
            {
                id: 602,
                title: 'JWT Authentication',
                order: 2,
                completed: false,
            },
            {
                id: 603,
                title: 'OAuth 2.0 & Social Login',
                order: 3,
                completed: false,
            },
            {
                id: 604,
                title: 'Input Validation & Sanitization',
                order: 4,
                completed: false,
            },
            {
                id: 605,
                title: 'HTTPS & Certificate Management',
                order: 5,
                completed: false,
                optional: true,
            },
            {
                id: 606,
                title: 'Security Testing & Auditing',
                order: 6,
                completed: false,
            },
        ],
        milestones: [
            {
                id: 6001,
                precedingLessonId: 601,
                completed: false,
            },
            {
                id: 6002,
                precedingLessonId: 604,
                completed: false,
            },
        ],
    },
    {
        id: 3,
        title: 'Backend Development',
        order: 3,
        lessons: [
            {
                id: 301,
                title: 'Node.js & Express Basics',
                order: 1,
                completed: true,
            },
            {
                id: 302,
                title: 'REST API Design',
                order: 2,
                completed: true,
            },
            {
                id: 303,
                title: 'Database Modeling with MongoDB',
                order: 3,
                completed: false,
                updated: true,
            },
            {
                id: 304,
                title: 'SQL Databases with PostgreSQL',
                order: 4,
                completed: false,
            },
            {
                id: 305,
                title: 'Authentication Strategies',
                order: 5,
                completed: false,
            },
            {
                id: 306,
                title: 'API Documentation with Swagger',
                order: 6,
                completed: false,
                optional: true,
            },
        ],
        milestones: [
            {
                id: 3001,
                precedingLessonId: 302,
                completed: true,
            },
            {
                id: 3002,
                precedingLessonId: 304,
                completed: false,
            },
            {
                id: 3003,
                precedingLessonId: 306,
                completed: false,
            },
        ],
    },
    {
        id: 5,
        title: 'Capstone Project',
        order: 5,
        lessons: [
            {
                id: 501,
                title: 'Project Planning & Architecture',
                order: 1,
                completed: false,
            },
            {
                id: 502,
                title: 'Setting up Development Environment',
                order: 2,
                completed: false,
            },
            {
                id: 503,
                title: 'Agile Development Workflow',
                order: 3,
                completed: false,
            },
            {
                id: 504,
                title: 'Frontend Implementation',
                order: 4,
                completed: false,
            },
            {
                id: 505,
                title: 'Backend API Development',
                order: 5,
                completed: false,
            },
            {
                id: 506,
                title: 'Integration & Testing',
                order: 6,
                completed: false,
            },
            {
                id: 507,
                title: 'Deployment Strategies',
                order: 7,
                completed: false,
            },
        ],
        milestones: [
            {
                id: 5001,
                precedingLessonId: 502,
                completed: false,
            },
            {
                id: 5002,
                precedingLessonId: 505,
                completed: false,
            },
            {
                id: 5003,
                precedingLessonId: 507,
                completed: false,
            },
        ],
    },
];

export const Unordered: StoryObj<typeof CourseOutlineAccordion> = {
    args: {
        locale: 'en',
        modules: unorderedCourseModules,
        activeLessonId: 301,
        onLessonClick: (lessonId) => console.log('Lesson clicked:', lessonId),
    },
};

export const German: StoryObj<typeof CourseOutlineAccordion> = {
    args: {
        locale: 'de',
        modules: courseModules,
        onLessonClick: (lessonId) => console.log('Lesson clicked:', lessonId),
    },
};
