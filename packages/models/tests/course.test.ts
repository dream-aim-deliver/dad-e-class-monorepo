import { CourseMetadataSchema, TCourseMetadata } from '../src/course';
import { describe, it, expect } from 'vitest';

describe('course', () => {

    it('should validate course metadata', () => {
        const validCourse: TCourseMetadata = {
            title: 'Introduction to TypeScript',
            description: 'A beginner-friendly introduction to TypeScript.',
            duration: { video: 60, coaching: 30, selfStudy: 90 },
            pricing: { fullPrice: 100, partialPrice: 50, currency: 'CHF' },
            imageUrl: '',
            rating: 0,
            author: { name: 'John Doe', image: '' },
            language: { code: "ENG", name: "English" },
        };
        expect(CourseMetadataSchema.safeParse(validCourse).success).toBe(true);
    });

});
