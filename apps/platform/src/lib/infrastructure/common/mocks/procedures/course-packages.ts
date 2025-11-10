import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const getCoursePackagesMock: useCaseModels.TGetCoursePackagesSuccessResponse['data'] =
    {
        packages: [
            {
                id: 'package-1',
                title: 'Complete Course Package',
                description: 'Get access to the full course with all materials, exercises, and bonus content.',
                duration: 120,
                imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
                pricing: {
                    currency: 'USD',
                    fullPrice: 299,
                    partialPrice: 249,
                },
                courseCount: 1,
            },
            {
                id: 'package-2',
                title: 'Premium Package',
                description: 'Enhanced learning experience with additional resources and priority support.',
                duration: 150,
                imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
                pricing: {
                    currency: 'USD',
                    fullPrice: 399,
                    partialPrice: 349,
                },
                courseCount: 1,
            },
            {
                id: 'package-3',
                title: 'Bundle Package',
                description: 'Save more with this comprehensive bundle including related courses.',
                duration: 200,
                imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop',
                pricing: {
                    currency: 'USD',
                    fullPrice: 499,
                    partialPrice: 399,
                },
                courseCount: 3,
            },
        ],
    };

export const getCoursePackages = t.procedure
    .input(useCaseModels.GetCoursePackagesRequestSchema)
    .query(
        async (): Promise<useCaseModels.TGetCoursePackagesUseCaseResponse> => {
            return {
                success: true,
                data: getCoursePackagesMock,
            };
        },
    );
