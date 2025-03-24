import { Descendant } from 'slate';

/**
 * Converts Slate editor data to a JSON string.
 * Ensures that an empty document is returned if the data is undefined or empty.
 *
 * @param {Descendant[]} slateData - The Slate editor content.
 * @returns {string} - JSON string representation of the Slate content.
 */
const slateToString = (slateData: Descendant[]): string => {
    if (!slateData || (Array.isArray(slateData) && slateData.length === 0)) {
      return JSON.stringify([{ type: "paragraph", children: [{ text: "" }] }]);
    }
    return JSON.stringify(slateData);
};

/**
 * Converts a JSON string back into Slate editor data.
 * Handles cases where the input string is empty, null, or undefined by returning a default paragraph.
 *
 * @param {string} stringData - The JSON string representing Slate content.
 * @returns {Descendant[]} - Parsed Slate content or a default paragraph if invalid.
 */
const stringToSlate = (stringData: string): Descendant[] => {
    if (!stringData || stringData === "" || stringData === "null" || stringData === "undefined") {
      return [{ type: "paragraph", children: [{ text: "" }] }];
    }
    try {
      const parsed = JSON.parse(stringData);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return [{ type: "paragraph", children: [{ text: "" }] }];
      }
      return parsed;
    } catch (error) {
      console.error("Error parsing slate content:", error);
      return [{ type: "paragraph", children: [{ text: "" }] }];
    }
};

export { slateToString, stringToSlate };