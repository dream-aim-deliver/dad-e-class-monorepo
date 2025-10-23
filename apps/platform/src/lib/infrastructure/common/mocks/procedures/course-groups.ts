import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

// TODO: Replace with actual backend data - Mock data for course-specific groups
const allGroupsData = [
    {
        groupId: 'js-fundamentals-group',
        groupName: 'JavaScript Fundamentals',
        currentStudents: 12,
        totalStudents: 20,
        course: {
            image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
            title: 'Learn the basics of JavaScript programming',
            slug: 'javascript-fundamentals',
        },
        coach: {
            name: 'You',
            isCurrentUser: true,
        },
        creator: {
            name: 'Current User',
            image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
        },
    },
    {
        groupId: 'advanced-react-group',
        groupName: 'Advanced React Patterns',
        currentStudents: 8,
        totalStudents: 15,
        course: {
            image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
            title: 'Master advanced React concepts and patterns',
            slug: 'advanced-react',
        },
        creator: {
            name: 'Sarah Johnson',
            image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
        },
    },
    {
        groupId: 'fullstack-dev-group',
        groupName: 'Full-Stack Development',
        currentStudents: 15,
        totalStudents: 18,
        course: {
            image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
            title: 'Complete web development with React and Node.js',
            slug: 'full-stack-development',
        },
        coach: {
            name: 'You',
            isCurrentUser: true,
        },
        creator: {
            name: 'Current User',
            image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
        },
    },
    {
        groupId: 'ui-ux-design-group',
        groupName: 'UI/UX Design Principles',
        currentStudents: 20,
        totalStudents: 20,
        course: {
            image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
            title: 'Learn design thinking and user experience principles',
            slug: 'ui-ux-design',
        },
        creator: {
            name: 'Jessica Wilson',
            image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
        },
    },
    {
        groupId: 'web-performance-group',
        groupName: 'Web Performance Optimization',
        currentStudents: 6,
        totalStudents: 12,
        course: {
            image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
            title: 'Optimize your web applications for speed and performance',
            slug: 'web-performance',
        },
        creator: {
            name: 'Performance Expert',
            image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
        },
    },
    {
        groupId: 'api-development-group',
        groupName: 'API Development & Testing',
        currentStudents: 14,
        totalStudents: 22,
        course: {
            image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
            title: 'Learn to build and test RESTful APIs',
            slug: 'api-development',
        },
        creator: {
            name: 'David Chen',
            image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
        },
    },
    {
        groupId: 'cloud-computing-group',
        groupName: 'Cloud Computing Essentials',
        currentStudents: 22,
        totalStudents: 30,
        course: {
            image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
            title: 'Learn AWS, Azure, and Google Cloud Platform fundamentals',
            slug: 'cloud-computing',
        },
        coach: {
            name: 'You',
            isCurrentUser: true,
        },
        creator: {
            name: 'Current User',
            image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
        },
    },
    {
        groupId: 'machine-learning-group',
        groupName: 'Machine Learning Basics',
        currentStudents: 14,
        totalStudents: 20,
        course: {
            image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
            title: 'Introduction to ML algorithms and Python libraries',
            slug: 'machine-learning',
        },
        creator: {
            name: 'Dr. Sarah Thompson',
            image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
        },
    },
];

const courseGroupsMockData: Record<string, any> = {
    // All course slugs return the same comprehensive groups dataset
    'reactjs': { groups: allGroupsData },
    'react': { groups: allGroupsData },
    'javascript': { groups: allGroupsData },
    'web-development': { groups: allGroupsData },
    'basic-course': { groups: allGroupsData },
    'default': { groups: allGroupsData },
};

// Mock procedure for listing course groups
export const listCourseGroups = t.procedure
    .input((input: any) => {
        // TODO: Add proper input validation schema when backend is ready
        return input;
    })
    .query(({ input }) => {
        try {
            const { courseSlug } = input;
            
            // TODO: Replace with actual backend call
            const courseData = courseGroupsMockData[courseSlug] || courseGroupsMockData['default'];
            
            // Mock successful response - return just the data part
            return courseData;
        } catch (error) {
            // Mock error response
            throw new Error('Failed to retrieve course groups');
        }
    });

// Mock procedure for registering coach to group
export const registerCoachToGroup = t.procedure
    .input((input: any) => {
        // TODO: Add proper input validation schema when backend is ready
        return input;
    })
    .mutation(({ input }) => {
        try {
            const { groupId, coachId } = input;
            
            // TODO: Replace with actual backend call
            // Mock successful response - return just the data part
            return {
                groupId,
                coachId,
                registeredAt: new Date().toISOString(),
            };
        } catch (error) {
            // Mock error response
            throw new Error('Failed to register coach to group');
        }
    });