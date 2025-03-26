import { CoachingSessionReviewSchema, TCoachingSessionReview } from '../src/coaching-session-review';
import { describe, it, expect } from 'vitest';

describe('coaching session review', () => {

    it('should validate coaching session review', () => {
        const validCoachReview: TCoachingSessionReview = {
            rating: 4,
            review: 'This is a review',
            neededMoreTime: false,
            timestamp: '2021-09-30T12:00:00.000Z',
        }
        expect(CoachingSessionReviewSchema.safeParse(validCoachReview).success).toBe(true)
    });

    it('should invalidate a coaching session review with missing required fields', () => {
        const invalidCoachReview = {
            // Missing 'rating'
            review: 'This is a review',
            neededMoreTime: false,
            timestamp: '2021-09-30T12:00:00.000Z',
        
        }
        expect(CoachingSessionReviewSchema.safeParse(invalidCoachReview).success).toBe(false)
    });

    it('should invalidate a coaching session review with an invalid rating', () => {
        const invalidCoachReview = {
            rating: 6,  // Rating should be between 0 and 5
            review: 'This is a review',
            neededMoreTime: false,
            timestamp: '2021-09-30T12:00:00.000Z',
        }
        expect(CoachingSessionReviewSchema.safeParse(invalidCoachReview).success).toBe(false)
    });
});