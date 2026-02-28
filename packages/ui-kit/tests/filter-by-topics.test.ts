import { describe, it, expect } from 'vitest';
import { matchesTopicFilter } from '../lib/utils/filter-by-topics';

describe('matchesTopicFilter', () => {
    it('returns true when selectedTopics is empty (show all items)', () => {
        expect(matchesTopicFilter([], ['react', 'nextjs'])).toBe(true);
    });

    it('returns true when selectedTopics is empty and item has no topics', () => {
        expect(matchesTopicFilter([], [])).toBe(true);
    });

    it('returns true when item has a matching topic', () => {
        expect(matchesTopicFilter(['react'], ['react', 'nextjs'])).toBe(true);
    });

    it('returns false when item has no matching topics', () => {
        expect(matchesTopicFilter(['vue'], ['react', 'nextjs'])).toBe(false);
    });

    it('returns true when multiple selected topics and item matches at least one', () => {
        expect(matchesTopicFilter(['vue', 'react'], ['react', 'nextjs'])).toBe(true);
    });

    it('returns false when item has no topics and filter is active', () => {
        expect(matchesTopicFilter(['react'], [])).toBe(false);
    });

    it('returns true when all selected topics match', () => {
        expect(matchesTopicFilter(['react', 'nextjs'], ['react', 'nextjs', 'typescript'])).toBe(true);
    });

    it('returns false when none of multiple selected topics match', () => {
        expect(matchesTopicFilter(['vue', 'angular'], ['react', 'nextjs'])).toBe(false);
    });
});
