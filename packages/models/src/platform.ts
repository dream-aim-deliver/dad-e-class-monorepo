import { z } from 'zod';

export const PlatformSchema = z.object({
    id: z.string().or(z.number()),
    name: z.string(),
    logoUrl: z.string(),
    backgroundImageUrl: z.string(),
    footerContent: z.string()
});

export type TPlatform = z.infer<typeof PlatformSchema>;
