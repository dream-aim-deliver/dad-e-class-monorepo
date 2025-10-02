import { z } from 'zod';

export const RoleSchema = z.enum(['visitor', 'student', 'coach', 'admin', 'superadmin']);
export type TRole = z.infer<typeof RoleSchema>;