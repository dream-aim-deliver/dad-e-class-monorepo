import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const getStudentCoachingSessionMock: useCaseModels.TGetStudentCoachingSessionSuccessResponse['data'] =
{
    session: {
        id: 7,
        coachingOfferingTitle: 'Normal Sprint',
        coachingOfferingDuration: 30,
        status: 'requested',
        startTime: '2025-09-27T14:00:00+00:00', // Future date for requested
        endTime: '2025-09-27T14:30:00+00:00',
        coach: {
            name: 'Alex',
            surname: 'Brown',
            username: 'alex_brown',
            avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80'
        },
        course: {
            id: 105,
            title: 'Backend Development with Node.js',
            slug: 'backend-development-nodejs'
        },
    },
};

export const getStudentCoachingSession = t.procedure
    .input(useCaseModels.GetStudentCoachingSessionRequestSchema)
    .query(
        async (): Promise<useCaseModels.TGetStudentCoachingSessionUseCaseResponse> => {
            return {
                success: true,
                data: getStudentCoachingSessionMock,
            };
        },
    );
