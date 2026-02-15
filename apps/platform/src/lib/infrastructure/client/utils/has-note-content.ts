/**
 * Checks if a serialized Slate rich-text string contains any actual text content.
 * Handles both literal empty strings and serialized empty editor state
 * (e.g. `[{"type":"paragraph","children":[{"text":""}]}]`).
 */
export function hasNoteContent(notes: string): boolean {
  if (!notes || notes.trim() === '') return false;
  try {
    const parsed: unknown = JSON.parse(notes);
    if (!Array.isArray(parsed)) return false;

    function getText(nodes: unknown[]): string {
      let result = '';
      for (const node of nodes) {
        if (typeof node !== 'object' || node === null) continue;
        if ('text' in node && typeof node.text === 'string') {
          result += node.text;
        }
        if ('children' in node && Array.isArray(node.children)) {
          result += getText(node.children);
        }
      }
      return result;
    }

    return getText(parsed).trim().length > 0;
  } catch {
    // Not valid JSON — treat as plain text
    return notes.trim().length > 0;
  }
}
