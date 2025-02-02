import { EClassPackageSchema, TEClassPackage } from '../src/eclass-package';
import { describe, it, expect } from 'vitest';

describe('Package Schema Validation', () => {
    it('should validate a valid package', () => {
        const validPackage: TEClassPackage = {
            title: 'Premium Coaching Package',
            imageUrl: 'https://example.com/package.jpg',
            duration: 120,
            description: 'A comprehensive coaching package with expert guidance.',
            pricing: { fullPrice: 200, partialPrice: 100, currency: 'USD' },
        };
        expect(EClassPackageSchema.safeParse(validPackage).success).toBe(true);
    });

    it('should invalidate a package with missing fields', () => {
        const invalidPackage = {
            title: 'Basic Package',
            imageUrl: 'https://example.com/basic.jpg',
            description: 'A basic package.',
            pricing: { fullPrice: 100, partialPrice: 50, currency: 'USD' },
            // missing 'duration'
        };
        expect(EClassPackageSchema.safeParse(invalidPackage).success).toBe(false);
    });

    it('should invalidate a package with incorrect types', () => {
        const invalidPackage = {
            title: 'Advanced Package',
            imageUrl: 'https://example.com/advanced.jpg',
            duration: 'two hours', // Should be a number, not a string
            description: 'An advanced level package.',
            pricing: { fullPrice: '300', partialPrice: 150, currency: 'EUR' }, // fullPrice should be a number
        };
        expect(EClassPackageSchema.safeParse(invalidPackage).success).toBe(false);
    });

});
