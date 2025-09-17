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
            console.log(ctx.input);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return {
                success: true,
                data: saveCourseDetailsMock,
            };
        },
    );
