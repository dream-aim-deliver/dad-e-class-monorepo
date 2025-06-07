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
        title: 'BUTTER CHICKEN (Indian Recipe) with a special guest! || Gluten and lactose free 💚',
        description: 'Join us in the kitchen with our special guest as we cook a delicious Butter Chicken recipe that is both gluten and lactose free! Perfect for a cozy meal at home.',
        videoId: 'MF_8gx-lGaA',
        thumbnailUrl: 'https://img.youtube.com/vi/MF_8gx-lGaA/0.jpg',
        state: 'draft',
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
    }
};

const GetHomePageDummyAuthErrorResponse: GetHomePageUseCaseModels.TGetHomePageUsecaseResponse = {
    success: false,
    data: {
        message: 'You must be signed in to access this resource.',
        errorType: 'AuthenticationError',
        operation: 'getHomePage',
        context: {},
        trace: 'No trace available'
    }
};

const GetHomePageDummyValidationErrorResponse: GetHomePageUseCaseModels.TGetHomePageUsecaseResponse = {
    success: false,
    data: {
        message: 'Invalid input data provided.',
        errorType: 'ValidationError',
        operation: 'getHomePage',
        context: {},
        trace: 'No trace available'
    }
};

const selectResponse = (success: boolean): GetHomePageUseCaseModels.TGetHomePageUsecaseResponse => {
    if (success) {
        return GetHomePageDummySuccessResponse;
    } else {
        return GetHomePageDummyAuthErrorResponse
        // return GetHomePageDummyValidationErrorResponse
    }
};

export const getHomePage = t.procedure
    .input(GetHomePageInputSchema)
    .query(async (opts): Promise<GetHomePageUseCaseModels.TGetHomePageUsecaseResponse> => {
        // Simulate a delay to mimic an actual API call
        // await new Promise((resolve) => setTimeout(resolve, 1000));
        // Return the dummy success response
        return selectResponse(opts.input.success ?? true);
    });