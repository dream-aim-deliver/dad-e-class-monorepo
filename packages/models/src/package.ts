import { z } from 'zod'

export const PackageDurationSchema = z.object({
    hours: z.number(),
    minutes: z.number(),
})
export type TPackageDuration = z.infer<typeof PackageDurationSchema>

export const PackagePricingSchema = z.object({
    fullPrice: z.number(),
    partialPrice: z.number(),
    currency: z.string(),
})
export type TPackagePricing = z.infer<typeof PackagePricingSchema>


export const PackageSchema = z.object({
    title: z.string(),
    imageUrl: z.string(),
    duration: PackageDurationSchema,
    description: z.string(),
    pricing: PackagePricingSchema,
})

/**
 * Schema for a package
 * 
 * This schema validates the structure of course metadata objects, ensuring they contain
 * the required properties with the correct types.
 * 
 * Properties:
 */

export type TPackage = z.infer<typeof PackageSchema>