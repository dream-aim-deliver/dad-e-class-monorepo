import { CoachReviewSchema, TCoachReview } from '../src/coach-review';
import { describe, it, expect } from 'vitest';

describe('coach review', () => {

    it('should validate coach review', () => {
        const validCoachReview: TCoachReview = {
            rating: 4,
            review: 'This is a review',
            neededMoreTime: false,
            timestamp: '2021-09-30T12:00:00.000Z',
        }
        expect(CoachReviewSchema.safeParse(validCoachReview).success).toBe(true)
    });

    it('should invalidate a coach review with missing required fields', () => {
        const invalidCoachReview = {
            // Missing 'rating'
            review: 'This is a review',
            neededMoreTime: false,
            timestamp: '2021-09-30T12:00:00.000Z',
        
        }
        expect(CoachReviewSchema.safeParse(invalidCoachReview).success).toBe(false)
    });

    it('should invalidate a coach review with an invalid rating', () => {
        const invalidCoachReview = {
            rating: 6,  // Rating should be between 0 and 5
            review: 'This is a review',
            neededMoreTime: false,
            timestamp: '2021-09-30T12:00:00.000Z',
        }
        expect(CoachReviewSchema.safeParse(invalidCoachReview).success).toBe(false)
    });
});