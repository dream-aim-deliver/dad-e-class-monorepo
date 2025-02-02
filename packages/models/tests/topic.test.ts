import { TopicSchema, TTopic } from '../src/topic';
import { describe, it, expect } from 'vitest';

describe('Topic Schema Validation', () => {
    it('should validate a valid topic', () => {
        const validTopic: TTopic = {
            name: 'JavaScript',
        };
        expect(TopicSchema.safeParse(validTopic).success).toBe(true);
    });

    it('should invalidate a topic with a missing name', () => {
        const invalidTopic = {};
        expect(TopicSchema.safeParse(invalidTopic).success).toBe(false);
    });

    it('should invalidate a topic with incorrect data type', () => {
        const invalidTopic = {
            name: 12345, // Should be a string
        };
        expect(TopicSchema.safeParse(invalidTopic).success).toBe(false);
    });
});
