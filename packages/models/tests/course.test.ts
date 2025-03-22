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
            author: { name: 'John Doe', image: '' },
            language: { code: "ENG", name: "English" },
        };
        expect(CourseMetadataSchema.safeParse(validCourse).success).toBe(true);
    });

    it('should invalidate a course with missing required fields', () => {
        const invalidCourse = {
            title: 'Advanced TypeScript',
            duration: { video: 120, coaching: 60, selfStudy: 180 },
            pricing: { fullPrice: 150, partialPrice: 75, currency: 'USD' },
            author: { name: 'Jane Doe', image: 'https://example.com/janedoe.jpg' },
            // Missing 'description' and 'imageUrl'
            language: { code: 'ENG', name: 'English' },
        };
        expect(CourseMetadataSchema.safeParse(invalidCourse).success).toBe(false);
    });

    it('should invalidate a course with incorrect data types', () => {
        const invalidCourse = {
            title: 'JavaScript Essentials',
            description: 'A complete guide to JavaScript.',
            duration: { video: 'sixty', coaching: 30, selfStudy: 90 }, // 'video' should be a number
            pricing: { fullPrice: 200, partialPrice: '100', currency: 'EUR' }, // 'partialPrice' should be a number
            imageUrl: 'https://example.com/javascript.jpg',
            author: { name: 'Alice Doe', image: 'https://example.com/alicedoe.jpg' },
            language: { code: 'ENG', name: 'English' },
        };
        expect(CourseMetadataSchema.safeParse(invalidCourse).success).toBe(false);
    });

});
