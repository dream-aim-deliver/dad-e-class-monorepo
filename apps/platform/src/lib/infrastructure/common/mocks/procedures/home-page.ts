import { GetHomePageUseCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';
import { z } from 'zod';

const GetHomePageInputSchema = z.object({
    success: z.boolean().optional(), // Optional boolean to simulate success or failure
    // TODO: to be defined based on the actual requirements    
});
const GetHomePageDummySuccessResponse: GetHomePageUseCaseModels.TGetHomePageUsecaseResponse = {
    success: true,
    data: {
        title: 'Sample Title',
        description: 'Sample Description',
        videoId: 'sample-video-id',
        thumbnailUrl: 'https://example.com/sample-thumbnail.jpg',
        state: 'draft',
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
    }
};
const selectResponse = (success: boolean): GetHomePageUseCaseModels.TGetHomePageUsecaseResponse => {
    if (success) {
        return GetHomePageDummySuccessResponse;
    } else {
        return {
            success: false,
            errorType: 'ValidationError',
            data: {
                message: 'An unknown error occurred',
                operation: 'getHomePage',
                context: {},
                trace: 'No trace available'
            }
        }
    }
};

export const getHomePage = t.procedure
    .input(GetHomePageInputSchema)
    .query(async (opts): Promise<GetHomePageUseCaseModels.TGetHomePageUsecaseResponse> => {
        // Simulate a delay to mimic an actual API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Return the dummy success response
        return selectResponse(opts.input.success ?? true);
    });