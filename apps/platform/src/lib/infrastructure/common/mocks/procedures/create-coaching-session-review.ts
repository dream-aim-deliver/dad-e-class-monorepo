import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';
import { updateSessionWithReview } from './student-coaching-sessions';

export const createCoachingSessionReview = t.procedure
    .input(useCaseModels.CreateCoachingSessionReviewRequestSchema)
    .mutation<useCaseModels.TCreateCoachingSessionReviewUseCaseResponse>((opts) => {
        const { coachingSessionId, rating, notes, neededMoreTime } = opts.input;

        // Mock logic: Create the review and update the session state
        // In a real app, this would call the backend
        const mockReview: useCaseModels.TCoachingSessionReview = {
            id: coachingSessionId, // Use the session ID as the review ID
            rating,
            notes: notes || null,
            neededMoreTime,
        };

        // Update the session with the new review (simulates backend state update)
        updateSessionWithReview(coachingSessionId, rating, notes || null);

        return {
            success: true,
            data: {
                review: mockReview,
            },
        };
    });
