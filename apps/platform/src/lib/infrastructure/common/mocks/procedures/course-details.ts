import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const saveCourseDetailsMock: useCaseModels.TSaveCourseDetailsSuccessResponse['data'] =
    {};

export const saveCourseDetails = t.procedure
    .input(useCaseModels.SaveCourseDetailsRequestSchema)
    .mutation(
        async (
            ctx,
        ): Promise<useCaseModels.TSaveCourseDetailsUseCaseResponse> => {
            return {
                success: true,
                data: saveCourseDetailsMock,
            };
        },
    );
