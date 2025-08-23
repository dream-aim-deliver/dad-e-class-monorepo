import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const getCourseIntroductionMock: useCaseModels.TGetCourseIntroductionSuccessResponse['data'] =
    {
        courseVersion: 1,
        text: JSON.stringify([
            {
                type: 'paragraph',
                children: [
                    {
                        text: 'Our intelligent matching system connects you with the perfect opportunities. Using advanced algorithms, we analyze your ',
                    },
                    {
                        text: 'skills, preferences, and goals',
                        bold: true,
                    },
                    {
                        text: ' to find the most suitable matches for your profile.',
                    },
                ],
            },
            {
                type: 'paragraph',
                children: [
                    {
                        text: 'Get personalized recommendations that align with your career aspirations and expertise level.',
                    },
                ],
            },
        ]),
        video: {
            id: '1',
            name: 'advanced-react-patterns.mp4',
            size: 102400,
            category: 'video',
            downloadUrl:
                'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
            playbackId: '102R01TI2leK9vznt4qvfta9FTsj100U4TD24XbB2Gzpl8',
            thumbnailUrl:
                'https://images.unsplash.com/photo-1750785328656-eb4c9942e58f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
    };

export const getCourseIntroduction = t.procedure
    .input(useCaseModels.GetCourseIntroductionRequestSchema)
    .query(
        async (): Promise<useCaseModels.TGetCourseIntroductionUseCaseResponse> => {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
            return {
                success: true,
                data: getCourseIntroductionMock,
            };
        },
    );
