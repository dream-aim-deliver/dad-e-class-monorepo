import { CourseMetedataSchema, TCourseMetedata } from '../src/course';
import { describe, it, expect } from 'vitest';

describe('course', () => {
    it('should validate course metadata', () => {
        const validCourse: TCourseMetedata = {
            title: 'Introduction to TypeScript',
            description: 'A beginner-friendly introduction to TypeScript.',
            duration: 60,
        };
        expect(CourseMetedataSchema.safeParse(validCourse).success).toBe(true);
    });
});
