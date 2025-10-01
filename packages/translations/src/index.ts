export * from './lib/get-dictionary';
export * from './lib/i18n.config';
export * from './lib/dictionaries/base';
export * from './lib/dictionaries/de';
export * from './lib/dictionaries/en';
export * from './lib/utils/react';
export * from './lib/utils/dictionary-utils';
export * from './lib/types/namespace-keys';

// Type alias for translation namespaces
export type { TDictionary } from './lib/dictionaries/base';
import type { TDictionary } from './lib/dictionaries/base';
import type { NamespaceKeys } from './lib/types/namespace-keys';

/**
 * Type representing all valid translation namespace paths.
 * These are dot-notation paths to objects in the dictionary.
 *
 * @example
 * 'components.navbar' | 'components.courseCard' | 'pages.home'
 */
export type TNamespace = NamespaceKeys<TDictionary>;

