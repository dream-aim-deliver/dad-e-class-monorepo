import { z } from 'zod'

export const CategorySchema = z.object({
    name: z.string(),
    description: z.string(),
    imageUrl: z.string(),
})

/**
 * Schema for a category.
 * 
 * This schema validates the structure of course metadata objects, ensuring they contain
 * the required properties with the correct types.
 * 
 * Properties:
 * - `name`: A string representing the name of the category.
 * - `description`: A string providing a brief description of the category.
 * - `imageUrl`: A string representing the URL of the category image.
 */

export type TCategory = z.infer<typeof CategorySchema>