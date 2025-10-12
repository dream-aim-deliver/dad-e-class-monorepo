import { z } from 'zod';

export const RoleSchema = z.enum(['visitor', 'student', 'coach', 'course_creator', 'admin', 'superadmin']);
export type TRole = z.infer<typeof RoleSchema>;