import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const packagesMock: useCaseModels.TListOffersPagePackagesSuccessResponse['data'] =
    {
        packages: [
            {
                id: 'pkg-001',
                title: 'Full Stack Web Development Bootcamp',
                slug: 'full-stack-web-development-bootcamp',
                description:
                    'Master modern web development with React, Node.js, and MongoDB. Build real-world projects and deploy to production. Perfect for beginners looking to become job-ready developers.',
                imageUrl:
                    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                courseCount: 8,
                duration: 1000,
                pricing: {
                    allCourses: 1299,
                    actual: 899,
                    currency: 'USD',
                },
            },
            {
                id: 'pkg-002',
                title: 'Data Science & Machine Learning Mastery',
                slug: 'data-science-machine-learning-mastery',
                description:
                    'Transform your career with Python, pandas, scikit-learn, and TensorFlow. Learn statistical analysis, data visualization, and build ML models from scratch to deployment.',
                imageUrl:
                    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                courseCount: 12,
                duration: 800,
                pricing: {
                    allCourses: 1899,
                    actual: 1299,
                    currency: 'USD',
                },
            },
            {
                id: 'pkg-003',
                title: 'Mobile App Development with React Native',
                slug: 'mobile-app-development-react-native',
                description:
                    'Build cross-platform mobile apps for iOS and Android using React Native. Learn navigation, state management, API integration, and publish to app stores.',
                imageUrl:
                    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                courseCount: 6,
                duration: 600,
                pricing: {
                    allCourses: 999,
                    actual: 699,
                    currency: 'USD',
                },
            },
        ],
    };

export const listOffersPagePackages = t.procedure
    .input(useCaseModels.ListOffersPagePackagesRequestSchema)
    .query(
        async (): Promise<useCaseModels.TListOffersPagePackagesUseCaseResponse> => {
            return {
                success: true,
                data: packagesMock,
            };
        },
    );
