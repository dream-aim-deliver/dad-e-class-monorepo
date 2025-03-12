import { CoachingOfferSchema, TCoachingOffer } from '../src/coaching-offer';
import { describe, it, expect } from 'vitest';

describe('coaching offer', () => {

    it('should validate coaching offer', () => {
        const validCoachingOffer: TCoachingOffer = {
            title: 'Coaching Offer Title',
            description: 'Coaching Offer Description',
            duration: 60,
            price: 100,
            currency: 'CHF',
        }
        expect(CoachingOfferSchema.safeParse(validCoachingOffer).success).toBe(true)
    });

    it('should invalidate a coaching offer with missing required fields', () => {
        const invalidCoachingOffer = {
            title: 'Coaching Offer Title',
            description: 'Coaching Offer Description',
            duration: 60,
            // Missing 'price' and 'currency'
        }
        expect(CoachingOfferSchema.safeParse(invalidCoachingOffer).success).toBe(false)
    });

    it('should invalidate a coaching offer with an invalid price', () => {
        const invalidCoachingOffer = {
            title: 'Coaching Offer Title',
            description: 'Coaching Offer Description',
            duration: 60,
            price: -1,  // Price should be a positive number
            currency: 'CHF',
        }
        expect(CoachingOfferSchema.safeParse(invalidCoachingOffer).success).toBe(false)
    });

    it('should invalidate a coaching offer with an invalid duration', () => {
        const invalidCoachingOffer = {
            title: 'Coaching Offer Title',
            description: 'Coaching Offer Description',
            duration: -1,  // Duration should be a positive number
            price: 100,
            currency: 'CHF',
        }
        expect(CoachingOfferSchema.safeParse(invalidCoachingOffer).success).toBe(false)
    });


});