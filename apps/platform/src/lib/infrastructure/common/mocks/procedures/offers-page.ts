import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const offersPageOutlineMock: useCaseModels.TGetOffersPageOutlineSuccessResponse['data'] =
{
    title: 'Offers Tailored to You',
    description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    items: [
        {
            title: 'Discover Amazing Destinations',
            description:
                'Explore breathtaking landscapes and hidden gems around the world. From pristine beaches to towering mountains, adventure awaits at every corner.',
            badge: 'Featured',
            imageUrl:
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
            buttonText: 'Start Exploring',
            buttonUrl: '/destinations',
        },
        {
            title: 'Master New Skills Today',
            description:
                'Join thousands of learners who are advancing their careers with our comprehensive online courses. Expert instructors and hands-on projects included.',
            badge: 'Popular',
            imageUrl:
                'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
            buttonText: 'Browse Courses',
            buttonUrl: '/courses',
        },
        {
            title: 'Delicious Recipes Made Simple',
            description:
                'Transform your kitchen into a culinary paradise with our step-by-step recipes. From quick weeknight dinners to impressive weekend treats.',
            badge: null,
            imageUrl:
                'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
            buttonText: 'View Recipes',
            buttonUrl: '/recipes',
        },
        {
            title: 'Boost Your Productivity',
            description:
                'Streamline your workflow with powerful tools and techniques. Learn how successful professionals manage their time and achieve more every day.',
            badge: 'New',
            imageUrl:
                'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
            buttonText: 'Get Started',
            buttonUrl: '/productivity',
        },
        {
            title: 'Connect with Nature',
            description:
                'Escape the hustle and bustle of city life. Discover peaceful hiking trails, camping spots, and outdoor activities that rejuvenate your soul.',
            badge: 'Trending',
            imageUrl:
                'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
            buttonText: 'Find Trails',
            buttonUrl: '/outdoor',
        },
    ],
};

export const getOffersPageOutline = t.procedure
    .input(useCaseModels.GetOffersPageOutlineRequestSchema)
    .query(
        async (
            opts,
        ): Promise<useCaseModels.TGetOffersPageOutlineUseCaseResponse> => {
            return {
                success: true,
                data: offersPageOutlineMock,
            };
        },
    );
