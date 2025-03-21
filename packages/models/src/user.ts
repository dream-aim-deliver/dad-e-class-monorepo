import { z } from 'zod';

export const UserSchema = z.object({
    id: z.string(),
    email: z.string(),
    name: z.string(),
    image: z.string(),
});

export type TUser = z.infer<typeof UserSchema>;