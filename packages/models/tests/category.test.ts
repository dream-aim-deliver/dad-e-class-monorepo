import { CategorySchema, TCategory } from '../src/category';
import { describe, it, expect } from 'vitest';

describe('Category Schema Validation', () => {

    it('should validate a valid category', () => {
        const validCategory: TCategory = {
            name: 'Programming',
            description: 'Courses related to programming and software development.',
            imageUrl: 'https://example.com/programming.jpg',
        };
        expect(CategorySchema.safeParse(validCategory).success).toBe(true);
    });

    it('should invalidate a category with missing required fields', () => {
        const invalidCategory = {
            name: 'Design',
            description: 'Courses related to graphic and UI/UX design.',
            // Missing 'imageUrl'
        };
        expect(CategorySchema.safeParse(invalidCategory).success).toBe(false);
    });

    it('should invalidate a category with incorrect data types', () => {
        const invalidCategory = {
            name: 12345, // Should be a string
            description: 'A category about business courses.',
            imageUrl: true, // Should be a string
        };
        expect(CategorySchema.safeParse(invalidCategory).success).toBe(false);
    });
});