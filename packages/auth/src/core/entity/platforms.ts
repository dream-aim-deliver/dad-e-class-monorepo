import { z } from 'zod';

export const PlatformSchema = z.enum(['bewerbeagentur', 'just-do-add', 'job-brand-me', 'dev']);
export type TPlatform = z.infer<typeof PlatformSchema>;