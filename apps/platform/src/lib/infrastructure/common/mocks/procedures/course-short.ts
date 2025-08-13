import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const getCourseShortMock: useCaseModels.TGetCourseShortSuccessResponse['data'] =
    {
        title: 'Awesome Course',
        imageUrl:
            'https://plus.unsplash.com/premium_photo-1752521131899-ffc4b14543ba?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    };

export const getCourseShort = t.procedure
    .input(useCaseModels.GetCourseShortRequestSchema)
    .query(async (): Promise<useCaseModels.TGetCourseShortUseCaseResponse> => {
        return {
            success: true,
            data: getCourseShortMock,
        };
    });
