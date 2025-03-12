import { z } from 'zod'

export const CoachingOfferSchema = z.object({
    title: z.string(),
    description: z.string(),
    duration: z.number().min(0),
    price: z.number().min(0),
    currency: z.string(),
});

/**
 * Schema for coaching offer.
 * 
 * This schema validates the structure of coaching offer objects, ensuring they contain
 * the required properties with the correct types.
 * 
 * Properties:
 * - `title`: A string representing the title of the coaching offer.
 * - `description`: A string providing a brief description of the coaching offer.
 * - `duration`: A number indicating the duration of the coaching offer.
 * - `price`: A number representing the price of the coaching offer.
 * - `currency`: A string representing the currency used for pricing.
 */
export type TCoachingOffer = z.infer<typeof CoachingOfferSchema>