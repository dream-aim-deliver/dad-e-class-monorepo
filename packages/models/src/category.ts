import { z } from 'zod'


export const CategorySchema = z.object({
    title: z.string(),
})

/**
 * Schema for a category.
 * 
 * This schema validates the structure of course metadata objects, ensuring they contain
 * the required properties with the correct types.
 * 
 * Properties:
 */

export type TCategory = z.infer<typeof CategorySchema>