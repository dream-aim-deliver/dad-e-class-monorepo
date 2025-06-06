import { z } from 'zod';
import { describe, it, expect } from 'vitest'

describe('Zoddu Schema Tests', () => {
    it('should validate a valid object against the schema', () => {
        const schema = z.object({
            name: z.string(),
            age: z.number().int().positive(),
            email: z.string().email(),
        });

        const validData = {
            name: 'John Doe',
            age: 30,
            email: 'john.doe@example.com',
        };

        const result = schema.safeParse(validData);
        expect(result.success).toBe(true);
        expect(result.data).toEqual(validData);
    });

    it('should extract the types of discriminated unions', () => {
        const schema = z.discriminatedUnion('type', [
            z.object({
                type: z.literal('cat'),
                name: z.string(),
                age: z.number().int().positive(),
            }),
            z.object({
                type: z.literal('dog'),
                name: z.string(),
                age: z.number().int().positive(),

            }),
        ]);
        type Animal = z.infer<typeof schema>;
        type AnimalType = Animal['type'];
        
        const options = schema.optionsMap.values();
        expect(options).toHaveLength(2);
      
    });
});
