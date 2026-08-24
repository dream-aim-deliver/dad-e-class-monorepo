import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CourseMaterialsAccordion } from '../lib/components/accordion/course-materials-accordion';

/**
 * Verifies that CourseMaterialsAccordion handles null entries in the `files`
 * array of a `downloadFiles` material without crashing.
 *
 * The fix is at ~line 110 of course-materials-accordion.tsx:
 *   material.files?.filter(Boolean).map(...)
 * which filters out null entries before iterating.
 */
describe('CourseMaterialsAccordion - null files handling', () => {
    it('renders successfully when files array in downloadFiles material contains null entries', () => {
        const dataWithNullFile = {
            modules: [
                {
                    id: 'module-1',
                    position: 1,
                    title: 'Test Module',
                    lessons: [
                        {
                            id: 'lesson-1',
                            position: 1,
                            title: 'Test Lesson',
                            materials: [
                                {
                                    type: 'downloadFiles' as const,
                                    id: 'mat-1',
                                    order: 1,
                                    files: [
                                        null,
                                        {
                                            id: '1',
                                            name: 'test.pdf',
                                            size: 100,
                                            category: 'generic' as const,
                                            downloadUrl: 'http://example.com',
                                            thumbnailUrl: null,
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                    lessonCount: 1,
                },
            ],
            moduleCount: 1,
        };

        const { container } = render(
            <CourseMaterialsAccordion
                data={dataWithNullFile as any}
                locale="en"
            />,
        );

        // Component should render without crashing
        expect(container).toBeTruthy();

        // Only the valid file should be rendered (null entry filtered out)
        const fileNames = container.querySelectorAll('[data-testid]');
        const textContent = container.textContent;
        expect(textContent).toContain('test.pdf');
    });
});
