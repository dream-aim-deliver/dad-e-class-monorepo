import { z } from 'zod'
import { LanguageSchema } from './language'

export const PackageSchema = z.object({

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