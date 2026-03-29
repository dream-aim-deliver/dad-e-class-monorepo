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

describe('matchesTopicFilter — category auto-select scenarios', () => {
    // Simulates the data shape from listTopicsByCategory
    const categoryToTopicsMap = new Map([
        [
            'Development',
            [
                { name: 'React', slug: 'react' },
                { name: 'Vue', slug: 'vue' },
                { name: 'Angular', slug: 'angular' },
            ],
        ],
        [
            'Design',
            [
                { name: 'UI/UX', slug: 'ui-ux' },
                { name: 'Figma', slug: 'figma' },
            ],
        ],
    ]);

    const courses = [
        { title: 'React Basics', topicSlugs: ['react'] },
        { title: 'Vue Advanced', topicSlugs: ['vue'] },
        { title: 'Figma Workshop', topicSlugs: ['figma'] },
        { title: 'Full Stack', topicSlugs: ['react', 'ui-ux'] },
        { title: 'No Topics', topicSlugs: [] },
    ];

    const coaches = [
        { name: 'Alice', skills: [{ slug: 'react' }, { slug: 'angular' }] },
        { name: 'Bob', skills: [{ slug: 'figma' }] },
        { name: 'Charlie', skills: [{ slug: 'vue' }, { slug: 'ui-ux' }] },
    ];

    it('selecting a category filters courses to only those with matching topics', () => {
        const devSlugs = categoryToTopicsMap
            .get('Development')!
            .map((t) => t.slug);

        const filtered = courses.filter((c) =>
            matchesTopicFilter(devSlugs, c.topicSlugs),
        );
        expect(filtered.map((c) => c.title)).toEqual([
            'React Basics',
            'Vue Advanced',
            'Full Stack',
        ]);
    });

    it('selecting a different category filters to its topics only', () => {
        const designSlugs = categoryToTopicsMap
            .get('Design')!
            .map((t) => t.slug);

        const filtered = courses.filter((c) =>
            matchesTopicFilter(designSlugs, c.topicSlugs),
        );
        expect(filtered.map((c) => c.title)).toEqual([
            'Figma Workshop',
            'Full Stack',
        ]);
    });

    it('selecting a category filters coaches by their skills', () => {
        const devSlugs = categoryToTopicsMap
            .get('Development')!
            .map((t) => t.slug);

        const filtered = coaches.filter((c) =>
            matchesTopicFilter(
                devSlugs,
                c.skills.map((s) => s.slug),
            ),
        );
        expect(filtered.map((c) => c.name)).toEqual(['Alice', 'Charlie']);
    });

    it('"all" tab (empty selection) shows all courses', () => {
        const filtered = courses.filter((c) =>
            matchesTopicFilter([], c.topicSlugs),
        );
        expect(filtered).toHaveLength(courses.length);
    });

    it('"all" tab (empty selection) shows all coaches', () => {
        const filtered = coaches.filter((c) =>
            matchesTopicFilter(
                [],
                c.skills.map((s) => s.slug),
            ),
        );
        expect(filtered).toHaveLength(coaches.length);
    });

    it('deselecting one topic within a category narrows results', () => {
        const devSlugs = categoryToTopicsMap
            .get('Development')!
            .map((t) => t.slug);

        // User deselects 'vue' from the Development category
        const withoutVue = devSlugs.filter((s) => s !== 'vue');

        const filtered = courses.filter((c) =>
            matchesTopicFilter(withoutVue, c.topicSlugs),
        );
        expect(filtered.map((c) => c.title)).toEqual([
            'React Basics',
            'Full Stack',
        ]);
    });

    it('cross-category topic on an item matches either category selection', () => {
        // "Full Stack" has ['react', 'ui-ux'] — spans Development and Design
        const fullStack = courses.find((c) => c.title === 'Full Stack')!;

        const devSlugs = categoryToTopicsMap
            .get('Development')!
            .map((t) => t.slug);
        const designSlugs = categoryToTopicsMap
            .get('Design')!
            .map((t) => t.slug);

        expect(matchesTopicFilter(devSlugs, fullStack.topicSlugs)).toBe(true);
        expect(matchesTopicFilter(designSlugs, fullStack.topicSlugs)).toBe(
            true,
        );
    });
});
