import { z } from 'zod'

export const EClassPackagePricingSchema = z.object({
    fullPrice: z.number(),
    partialPrice: z.number(),
    currency: z.string(),
    savingsWithoutCoachings: z.number().optional().nullable(),
    savingsWithCoachings: z.number().optional().nullable(),
    coachingSessionsTotal: z.number().optional().nullable(),
})
export type TEClassPackagePricing = z.infer<typeof EClassPackagePricingSchema>


export const EClassPackageSchema = z.object({
    title: z.string(),
    imageUrl: z.string(),
    duration: z.number(),  // in minutes
    description: z.string(),
    pricing: EClassPackagePricingSchema,
})

/**
 * Schema for a package
 * 
 * This schema validates the structure of course metadata objects, ensuring they contain
 * the required properties with the correct types.
 * 
 * Properties:
 * - `title`: A string representing the title of the course.
 * - `imageUrl`: A string representing the URL of the course image.
 * - `duration`: An object containing the hours and minutes of the course duration.
 * - `description`: A string providing a brief description of the course.
 * - `pricing`: An object containing the full price, partial price, and currency of the course.
 */

export type TEClassPackage = z.infer<typeof EClassPackageSchema>
