import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';
import { updateSessionWithReview } from './student-coaching-sessions';

export const createCoachingSessionReview = t.procedure
    .input(useCaseModels.CreateCoachingSessionReviewRequestSchema)
    .mutation<useCaseModels.TCreateCoachingSessionReviewUseCaseResponse>((opts) => {
        const { sessionId, rating, comment } = opts.input;

        // Mock logic: Create the review and update the session state
        // In a real app, this would call the backend
        // Since this is now connected to real backend, this should be replaced with actual API call
        
        return {
            success: true,
            data: {}
        };
    });