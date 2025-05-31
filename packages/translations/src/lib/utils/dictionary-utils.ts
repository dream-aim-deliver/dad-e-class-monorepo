/**
 * Formats a string by replacing placeholders with corresponding values from an object. Mimics Python's f-string functionality.
 *  * Placeholders in the string should be in the format %{placeholderName}, where placeholderName corresponds to a key in the params object.
 * 
 * @param str String with placeholders in the format %{placeholderName}
 * @param params Object containing key-value pairs where keys match the placeholders in the string
 * @returns Formatted string with placeholders replaced by corresponding values from params
 */
export function dictionaryFormat(
    str: string,
    params: Record<string, string | number>
): string {
    return str.replace(/%\{(\w+)\}/g, (_, key) =>
        Object.prototype.hasOwnProperty.call(params, key) ? String(params[key]) : ''
    );
}
