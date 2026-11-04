const COPY_TITLE_PREFIX = /^\[COPY\]\s*/i;
const META_DESCRIPTION_MAX_LENGTH = 155;

/**
 * Removes the duplicate-course `[COPY]` prefix from titles so it never ships in metadata.
 */
export function stripCopyPrefix(title: string | null | undefined): string {
    if (!title) {
        return '';
    }
    return title.replace(COPY_TITLE_PREFIX, '').trim();
}

function extractSlateText(node: unknown): string {
    if (node == null) {
        return '';
    }
    if (typeof node === 'string') {
        return node;
    }
    if (Array.isArray(node)) {
        return node.map(extractSlateText).filter(Boolean).join(' ');
    }
    if (typeof node === 'object') {
        const record = node as Record<string, unknown>;
        if (typeof record.text === 'string') {
            return record.text;
        }
        if ('children' in record) {
            return extractSlateText(record.children);
        }
    }
    return '';
}

/**
 * Converts Slate JSON / HTML / light Markdown into a single plain-text string.
 */
export function toPlainText(input: string | null | undefined): string {
    if (!input) {
        return '';
    }

    const trimmed = input.trim();
    if (!trimmed) {
        return '';
    }

    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
        try {
            const parsed = JSON.parse(trimmed) as unknown;
            const slateText = extractSlateText(parsed).replace(/\s+/g, ' ').trim();
            if (slateText) {
                return slateText;
            }
        } catch {
            // Not JSON — continue with HTML/Markdown stripping.
        }
    }

    let text = trimmed
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
        .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/(\*\*|__)(.*?)\1/g, '$2')
        .replace(/(\*|_)(.*?)\1/g, '$2')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'");

    return text.replace(/\s+/g, ' ').trim();
}

/**
 * Truncates plain text to ~155 characters on a word boundary for meta descriptions.
 */
export function truncateMetaDescription(
    text: string,
    maxLength: number = META_DESCRIPTION_MAX_LENGTH,
): string {
    const normalized = text.replace(/\s+/g, ' ').trim();
    if (normalized.length <= maxLength) {
        return normalized;
    }

    const slice = normalized.slice(0, maxLength + 1);
    const lastSpace = slice.lastIndexOf(' ');
    const cutAt =
        lastSpace > Math.floor(maxLength * 0.6) ? lastSpace : maxLength;

    return normalized.slice(0, cutAt).trimEnd().replace(/[.,;:!?\-–—]+$/u, '');
}

/**
 * Full pipeline: rich text → plain text → meta-length truncation.
 */
export function toMetaDescription(
    input: string | null | undefined,
    maxLength: number = META_DESCRIPTION_MAX_LENGTH,
): string {
    return truncateMetaDescription(toPlainText(input), maxLength);
}
