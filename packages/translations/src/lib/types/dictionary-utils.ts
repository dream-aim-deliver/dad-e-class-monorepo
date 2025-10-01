/**
 * Advanced type utilities for type-safe dictionary access.
 * These utilities enable extracting values at specific paths in the dictionary
 * with full type safety and IntelliSense support.
 */

/**
 * Splits a dot-notation path into an array of keys.
 *
 * @example
 * PathToArray<'components.navbar'> → ['components', 'navbar']
 */
type PathToArray<T extends string> = T extends `${infer First}.${infer Rest}`
  ? [First, ...PathToArray<Rest>]
  : [T];

/**
 * Extracts the value type at a given dot-notation path in an object.
 * Returns the type of the value at that path, or never if path is invalid.
 *
 * @example
 * ```ts
 * type Dict = {
 *   components: {
 *     navbar: {
 *       login: string;
 *       logout: string;
 *     };
 *   };
 * };
 *
 * GetValueAtPath<Dict, 'components.navbar'>
 * // → { login: string; logout: string; }
 *
 * GetValueAtPath<Dict, 'components.navbar.login'>
 * // → string
 * ```
 */
export type GetValueAtPath<T, Path extends string> =
  Path extends keyof T
    ? T[Path]
    : Path extends `${infer First}.${infer Rest}`
      ? First extends keyof T
        ? GetValueAtPath<T[First], Rest>
        : never
      : never;

/**
 * Returns the messages scoped to a specific namespace.
 * If no namespace is provided, returns the entire dictionary.
 *
 * @example
 * ```ts
 * type Dict = {
 *   components: {
 *     navbar: {
 *       login: string;
 *     };
 *   };
 * };
 *
 * ScopedMessages<Dict, 'components.navbar'>
 * // → { login: string; }
 *
 * ScopedMessages<Dict, never>
 * // → Dict
 * ```
 */
export type ScopedMessages<T, Namespace extends string | never> =
  [Namespace] extends [never]
    ? T
    : GetValueAtPath<T, Namespace>;

/**
 * Runtime utility to extract messages at a specific namespace path.
 * Safely navigates the dictionary object using dot notation.
 *
 * @param dictionary - The full dictionary object
 * @param namespace - Dot-notation path to the desired namespace (e.g., 'components.navbar')
 * @returns The messages object at the specified namespace, or the full dictionary if no namespace
 *
 * @example
 * ```ts
 * const dict = { components: { navbar: { login: 'Login' } } };
 * getScopedMessages(dict, 'components.navbar'); // → { login: 'Login' }
 * getScopedMessages(dict, undefined); // → entire dict
 * ```
 */
export function getScopedMessages<T extends Record<string, any>, Path extends string>(
  dictionary: T,
  namespace?: Path
): Path extends undefined ? T : GetValueAtPath<T, Path> {
  if (!namespace) {
    return dictionary as any;
  }

  const keys = namespace.split('.');
  let current: any = dictionary;

  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      throw new Error(
        `Invalid namespace path: "${namespace}". Failed at key "${key}". ` +
        `Current value is ${current === null ? 'null' : typeof current}.`
      );
    }

    if (!(key in current)) {
      throw new Error(
        `Invalid namespace path: "${namespace}". Key "${key}" does not exist in the dictionary.`
      );
    }

    current = current[key];
  }

  return current as any;
}

/**
 * Type guard to check if a value is a valid dictionary namespace.
 *
 * @param value - The value to check
 * @returns True if the value is an object (potential namespace), false otherwise
 */
export function isNamespace(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
