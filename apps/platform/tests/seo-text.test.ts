import { describe, expect, it } from 'vitest';
import {
    stripCopyPrefix,
    toMetaDescription,
    toPlainText,
    truncateMetaDescription,
} from '../src/lib/infrastructure/server/utils/seo-text';

describe('seo-text', () => {
    it('strips the [COPY] title prefix', () => {
        expect(stripCopyPrefix('[COPY] Branding')).toBe('Branding');
        expect(stripCopyPrefix('[copy] Branding')).toBe('Branding');
        expect(stripCopyPrefix('Branding')).toBe('Branding');
    });

    it('converts Slate JSON to plain text', () => {
        const slate = JSON.stringify([
            { type: 'h2', children: [{ text: 'Hello' }] },
            { type: 'paragraph', children: [{ text: 'World' }] },
        ]);
        expect(toPlainText(slate)).toBe('Hello World');
    });

    it('strips HTML tags', () => {
        expect(toPlainText('<p>Hello <strong>World</strong></p>')).toBe('Hello World');
    });

    it('truncates on a word boundary near 155 chars', () => {
        const words = Array.from({ length: 40 }, (_, i) => `Wort${i}`).join(' ');
        const truncated = truncateMetaDescription(words, 155);
        expect(truncated.length).toBeLessThanOrEqual(155);
        expect(truncated.endsWith(' ')).toBe(false);
        expect(words.startsWith(truncated)).toBe(true);
    });

    it('builds a meta description from rich text', () => {
        const slate = JSON.stringify([
            {
                type: 'paragraph',
                children: [
                    {
                        text: 'Ein starkes Key Visual ist mehr als nur ein Bild. Es ist das visuelle Zentrum deiner Botschaft und wirkt über längere Zeit.',
                    },
                ],
            },
        ]);
        const description = toMetaDescription(slate);
        expect(description.length).toBeLessThanOrEqual(155);
        expect(description).toContain('Key Visual');
        expect(description).not.toContain('[{');
    });
});
