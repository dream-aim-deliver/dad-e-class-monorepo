import { Descendant, Node } from 'slate';

/**
 * Converts Slate editor data to a JSON string.
 * Ensures that an empty document is returned if the data is undefined or empty.
 *
 * @param {Descendant[]} slateData - The Slate editor content.
 * @returns {string} - JSON string representation of the Slate content.
 */
const serialize = (slateData: Descendant[]): string => {
  if (!slateData || (Array.isArray(slateData) && slateData.length === 0)) {
    return JSON.stringify([{ type: "paragraph", children: [{ text: "" }] } as Descendant]);
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
    return [{ type: "paragraph", children: [{ text: "" }] } as Descendant];
  }
  return [{ type: "paragraph", children: [{ text: rawString }] } as Descendant];
}

/**
 * Converts a plain text string into Slate editor data, and then serializes it to JSON.
 * 
 * @param rawString 
 * @returns {string} - JSON string representation of the Slate content.
 */
const slateifySerialize = (input: string): string => serialize(slateify(input));



const safeStringify = (data: unknown): string => {
  if (data === null || data === undefined) {
    return "";
  } else if (typeof data === "string") {
    return data;

  } else if (Array.isArray(data)) {
    try {
      return JSON.stringify(data);
    } catch (error) {
      return `[[ Error stringifying array '${data}': ${error} ]]`;
    }

  } else if (typeof data === "object") {
    try {
      return JSON.stringify(data);
    } catch (error) {
      return `[[ Error stringifying object '${data}': ${error} ]]`;
    }
  };

  return String(data);
}


export interface SlateDeserializerInput {
  serializedData: string | Descendant[];
  onError: (message: string, error: Error) => void;
}

/**
 * Converts a JSON string back into Slate editor data.
 * Handles cases where the input string is empty, null, or undefined by returning a default paragraph.
 * Also handles cases where the input is already a parsed Descendant array, returning it directly (making this function idempotent).
 *
 * @param {string | Descendant[]} serializedData - The JSON string representing Slate content, or an already parsed Descendant array.
 * @param {function} onError - Callback function to handle errors during deserialization.
 * @returns {Descendant[]} - Parsed Slate content or a default paragraph if invalid.
 */
const deserialize = ({ serializedData, onError }: SlateDeserializerInput): Descendant[] => {

  if (!serializedData || serializedData === "" || serializedData === "null" || serializedData === "undefined") {
    return [{ type: "paragraph", children: [{ text: "" }] } as Descendant];
  }

  switch (typeof serializedData) {
    case "string":
      try {
        const parsed = JSON.parse(serializedData);
        if (!Array.isArray(parsed) || parsed.length === 0) {
          return [{ type: "paragraph", children: [{ text: "" }] } as Descendant];
        }
        return parsed;

      } catch (error) {
        // Not valid JSON - treat as plain text and wrap in a paragraph
        return [{ type: "paragraph", children: [{ text: serializedData }] } as Descendant];
      }

    default:
      if (Array.isArray(serializedData) && serializedData.length > 0) {
        return serializedData;
      }
      return [{ type: "paragraph", children: [{ text: "" }] } as Descendant];
  }

};

/**
 * Converts Slate editor data (JSON string or Descendant array) to plain text.
 * Extracts all text content from the nodes, joining with newlines.
 * Useful for displaying Slate content in contexts that don't support rich text (e.g., PDFs, plain text exports).
 *
 * @param {string | Descendant[]} slateData - The Slate content as JSON string or Descendant array
 * @returns {string} - Plain text content with nodes separated by newlines
 *
 * @example
 * const slateJson = '[{"type":"paragraph","children":[{"text":"Hello"}]}]';
 * slateToPlainText(slateJson); // Returns: "Hello"
 *
 * const slateArray = [{ type: "paragraph", children: [{ text: "Hello" }] }];
 * slateToPlainText(slateArray); // Returns: "Hello"
 */
const slateToPlainText = (slateData: string | Descendant[]): string => {
  if (!slateData) {
    return '';
  }

  try {
    let nodes: Descendant[];

    // Handle string input (JSON)
    if (typeof slateData === 'string') {
      // Try to parse if it's a JSON string
      try {
        nodes = JSON.parse(slateData);
      } catch {
        // If parsing fails, return the string as-is (might already be plain text)
        return slateData;
      }
    } else if (Array.isArray(slateData)) {
      nodes = slateData;
    } else {
      return '';
    }

    // Extract text from all nodes
    const text = nodes
      .map((n) => Node.string(n))
      .join('\n')
      .trim();

    return text;
  } catch (error) {
    console.error('Error converting Slate to plain text:', error);
    return '';
  }
};

export { serialize, slateify, slateifySerialize, deserialize, slateToPlainText };