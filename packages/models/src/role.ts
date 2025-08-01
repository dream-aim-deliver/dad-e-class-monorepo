import { z } from 'zod';

export const RoleSchema = z.enum(['visitor', 'student', 'coach', 'courseOwner', 'admin']);
export type TRole = z.infer<typeof RoleSchema>;