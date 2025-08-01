import { z } from 'zod';

export const RoleSchema = z.enum(['visitor', 'student', 'coach', 'admin']);
export type TRole = z.infer<typeof RoleSchema>;