import { Descendant } from 'slate';

/**
 * Converts Slate editor data to a JSON string.
 * Ensures that an empty document is returned if the data is undefined or empty.
 *
 * @param {Descendant[]} slateData - The Slate editor content.
 * @returns {string} - JSON string representation of the Slate content.
 */
const serialize = (slateData: Descendant[]): string => {
  if (!slateData || (Array.isArray(slateData) && slateData.length === 0)) {
    return JSON.stringify([{ type: "paragraph", children: [{ text: "" }] }]);
  }
  return JSON.stringify(slateData);
};


/**
 * Converts a plain text string into Slate editor data, put simply in a paragraph as text, with no formatting.
 * Useful for quickly converting plain text strings into Slate format, e.g., to test. 
 * @param rawString 
 * @returns {Descendant[]} - Slate content in a paragraph format.
 */
const slateify = (rawString: string): Descendant[] => {
  if (!rawString || rawString === "" || rawString === "null" || rawString === "undefined") {
    return [{ type: "paragraph", children: [{ text: "" }] }];
  }
  return [{ type: "paragraph", children: [{ text: rawString }] }];
}


/**
 * Converts a JSON string back into Slate editor data.
 * Handles cases where the input string is empty, null, or undefined by returning a default paragraph.
 * Also handles cases where the input is already a parsed Descendant array, returning it directly (making this function idempotent).
 *
 * @param {string | Descendant[]} serializedData - The JSON string representing Slate content, or an already parsed Descendant array.
 * @returns {Descendant[]} - Parsed Slate content or a default paragraph if invalid.
 */
const deserialize = (serializedData: string | Descendant[]): Descendant[] => {

  if (!serializedData || serializedData === "" || serializedData === "null" || serializedData === "undefined") {
    return [{ type: "paragraph", children: [{ text: "" }] }];
  }

  switch (typeof serializedData) {
    case "string":
      try {
        const parsed = JSON.parse(serializedData);
        if (!Array.isArray(parsed) || parsed.length === 0) {
          return [{ type: "paragraph", children: [{ text: "" }] }];
        }
        return parsed;
      } catch (error) {
        console.error(`SlateJS deserializer: error parsing string '${serializedData}': ${error}`);
        return [{ type: "paragraph", children: [{ text: "" }] }];
      }

    default:
      if (Array.isArray(serializedData) && serializedData.length > 0) {
        return serializedData;
      }
      return [{ type: "paragraph", children: [{ text: "" }] }];
  }

};

export { serialize, slateify, deserialize };