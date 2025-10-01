/**
 * Utility type to extract all nested key paths from an object type.
 * Generates dot-notation paths for all nested properties.
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
 *   pages: {
 *     home: {
 *       title: string;
 *     };
 *   };
 * };
 *
 * type Keys = NestedKeyOf<Dict>;
 * // Result: 'components' | 'components.navbar' | 'components.navbar.login' |
 * //         'components.navbar.logout' | 'pages' | 'pages.home' | 'pages.home.title'
 * ```
 */
export type NestedKeyOf<T extends object> = {
  [K in keyof T & (string | number)]: T[K] extends object
    ? T[K] extends any[] // Exclude arrays
      ? `${K}`
      : `${K}` | `${K}.${NestedKeyOf<T[K]>}`
    : `${K}`;
}[keyof T & (string | number)];

/**
 * Utility type to extract only the namespace-level keys (parent keys only).
 * This extracts keys that point to objects, not leaf string values.
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
 * type Namespaces = NamespaceKeys<Dict>;
 * // Result: 'components' | 'components.navbar'
 * ```
 */
export type NamespaceKeys<T extends object> = {
  [K in keyof T & (string | number)]: T[K] extends object
    ? T[K] extends any[]
      ? never
      : T[K] extends Record<string, any>
      ? keyof T[K] extends never
        ? never
        : `${K}` | `${K}.${NamespaceKeys<T[K]>}`
      : never
    : never;
}[keyof T & (string | number)];
