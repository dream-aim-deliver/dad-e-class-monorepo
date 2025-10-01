# Dual-Locale Management Guide

## Overview

The CMS application supports **two independent locale contexts**:

1. **App Locale**: The language for the user interface (navigation, buttons, labels)
   - Managed by next-intl
   - Route: `/[locale]/...` (e.g., `/en/...`, `/de/...`)
   - Accessed via: `useLocale()`, `useTranslations()`

2. **Platform Locale**: The language for platform-specific content
   - Managed by custom React Context
   - Route: `/[locale]/platform/[platform_slug]/[platform_locale]/...`
   - Accessed via: `usePlatformLocale()`, `useContentLocale()`

## Architecture

### Files Created

```
apps/cms/src/lib/infrastructure/
├── client/
│   ├── context/
│   │   └── platform-locale-context.tsx    # React Context for platform locale
│   └── hooks/
│       └── use-platform-translations.ts   # Custom hooks for platform content
└── server/
    └── utils/
        └── platform-translations.ts        # Server-side utilities
```

## Usage

### Client Components

#### Basic Usage - App Locale (UI)

For components that only need the app locale (most UI components):

```tsx
'use client';
import { useLocale, useTranslations } from 'next-intl';

export function Header() {
    const locale = useLocale();
    const t = useTranslations('components.navbar');

    return <button>{t('login')}</button>; // Uses app locale
}
```

#### Platform Routes - Accessing Both Locales

For components within platform routes that need both locales:

```tsx
'use client';
import { useLocale, useTranslations } from 'next-intl';
import { usePlatformLocale, useContentLocale } from '../hooks/use-platform-translations';

export function PlatformContent() {
    // App locale - for UI elements
    const appLocale = useLocale();
    const tUI = useTranslations('components.button');

    // Platform context - for platform info
    const platformContext = usePlatformLocale();

    // Content locale - for content display
    const contentLocale = useContentLocale();

    console.log('UI Language:', appLocale);           // e.g., 'en'
    console.log('Platform:', platformContext?.platformSlug);  // e.g., 'bewerbeagentur'
    console.log('Content Language:', contentLocale);  // e.g., 'de'

    return (
        <div>
            {/* UI in app locale */}
            <button>{tUI('save')}</button>

            {/* Display content locale */}
            <p>Showing content in: {contentLocale}</p>
        </div>
    );
}
```

#### Required Platform Context

Use `useRequiredPlatformLocale()` when a component MUST be within a platform route:

```tsx
import { useRequiredPlatformLocale } from '../context/platform-locale-context';

export function PlatformOnlyComponent() {
    // Throws error if not in platform context
    const { platformSlug, platformLocale } = useRequiredPlatformLocale();

    return <div>Platform: {platformSlug}</div>;
}
```

### Server Components

#### Using Platform Context in Server Components

```tsx
import { getPlatformTranslations, extractPlatformLocaleContext } from '../utils/platform-translations';

export default async function Page({ params }: { params: Promise<{ platform_locale: string }> }) {
    const resolvedParams = await params;
    const platformContext = extractPlatformLocaleContext(resolvedParams);

    if (platformContext) {
        const t = await getPlatformTranslations(platformContext.locale, 'components.courseCard');
        return <div>{t('title')}</div>;
    }

    return <div>No platform context</div>;
}
```

## API Reference

### Client Hooks

#### `usePlatformLocale()`
Returns the platform context if within a platform route, null otherwise.

```tsx
const platformContext = usePlatformLocale();
// Returns: { platformSlug: string, platformLocale: TLocale } | null
```

#### `useRequiredPlatformLocale()`
Returns the platform context, throws error if not in platform route.

```tsx
const { platformSlug, platformLocale } = useRequiredPlatformLocale();
// Throws if not within PlatformLocaleProvider
```

#### `useContentLocale()`
Returns the effective locale for content (platform locale if available, otherwise app locale).

```tsx
const contentLocale = useContentLocale();
// Returns: TLocale ('en' | 'de')
```

#### `usePlatformTranslations(namespace?)`
Returns translations using platform locale when available.

```tsx
const t = usePlatformTranslations('components.courseCard');
// Returns: translation function
```

#### `useIsInPlatformContext()`
Returns true if currently within a platform context.

```tsx
const isInPlatform = useIsInPlatformContext();
// Returns: boolean
```

### Server Utilities

#### `getPlatformTranslations(locale, namespace?)`
Get translations for a specific locale in server components.

```tsx
const t = await getPlatformTranslations('de', 'pages.home');
```

#### `getContentLocale(platformLocale?, appLocale)`
Get the effective content locale.

```tsx
const contentLocale = getContentLocale(params.platform_locale, locale);
```

#### `extractPlatformLocaleContext(params)`
Extract platform context from route parameters.

```tsx
const context = extractPlatformLocaleContext(params);
// Returns: { slug: string, locale: TLocale } | null
```

## Examples

### Example 1: Platform Management Page

Shows both app locale (for UI) and platform locale (for content):

```tsx
'use client';
import { useLocale } from 'next-intl';
import { useRequiredPlatformLocale, useContentLocale } from '../hooks/use-platform-translations';

export default function PlatformManagement() {
    const appLocale = useLocale();              // 'en' (UI language)
    const platformContext = useRequiredPlatformLocale(); // { platformSlug: 'bewerbeagentur', platformLocale: 'de' }
    const contentLocale = useContentLocale();   // 'de' (content language)

    return (
        <div>
            <div>UI Language: {appLocale}</div>
            <div>Platform: {platformContext.platformSlug}</div>
            <div>Content Language: {contentLocale}</div>
        </div>
    );
}
```

### Example 2: Conditional Rendering Based on Context

```tsx
import { usePlatformLocale } from '../context/platform-locale-context';

export function AdaptiveComponent() {
    const platformContext = usePlatformLocale();

    if (platformContext) {
        return <div>Platform Mode: {platformContext.platformSlug}</div>;
    }

    return <div>General Mode</div>;
}
```

## How It Works

### Route Structure

```
/[locale]                                    ← App locale (next-intl managed)
  /platform/
    /[platform_slug]/
      /[platform_locale]/                    ← Platform locale (context managed)
        /page.tsx                            ← Platform pages
        /layout.tsx                          ← Wraps with PlatformLocaleProvider
```

### Middleware Flow

1. User visits: `/en/platform/bewerbeagentur/de`
2. Middleware (apps/cms/src/middleware.ts):
   - Extracts locale from URL: `en`
   - Sets next-intl locale to `en`
3. Platform Layout (layout.tsx):
   - Extracts platform params: `platform_slug=bewerbeagentur`, `platform_locale=de`
   - Provides via PlatformLocaleProvider
4. Components:
   - UI elements use `useLocale()` → `en`
   - Content uses `useContentLocale()` → `de`

### Context Hierarchy

```tsx
<html lang={locale}>                         {/* locale = 'en' */}
  <NextIntlClientProvider locale="en">       {/* App locale */}
    <PlatformLocaleProvider                  {/* Platform locale */}
      platformSlug="bewerbeagentur"
      platformLocale="de"
    >
      <PlatformManagement />                 {/* Can access both locales */}
    </PlatformLocaleProvider>
  </NextIntlClientProvider>
</html>
```

## Best Practices

### 1. Use Appropriate Locale for Context

- **App Locale** (`useLocale()`): Navigation, buttons, form labels, error messages
- **Platform Locale** (`useContentLocale()`): Course titles, descriptions, user-generated content

### 2. Default to App Locale for UI

Always use app locale for UI elements to maintain consistency:

```tsx
const appLocale = useLocale();
return <DefaultError locale={appLocale} onRetry={refetch} />;
```

### 3. Document Locale Usage

Add comments to clarify which locale is being used:

```tsx
// App locale for UI
const appLocale = useLocale();

// Platform locale for content
const contentLocale = useContentLocale();
```

### 4. Handle Missing Platform Context Gracefully

```tsx
const platformContext = usePlatformLocale();
const effectiveLocale = platformContext?.platformLocale || useLocale();
```

## Troubleshooting

### Error: "useRequiredPlatformLocale must be used within PlatformLocaleProvider"

**Cause**: Component is used outside a platform route.

**Solution**: Either:
- Move component to platform route
- Use `usePlatformLocale()` instead and handle null case
- Wrap with PlatformLocaleProvider in parent

### Platform locale not reflecting in content

**Check**:
1. Is route under `/[locale]/platform/[platform_slug]/[platform_locale]/`?
2. Is layout.tsx wrapping with PlatformLocaleProvider?
3. Are you using `useContentLocale()` instead of `useLocale()`?

### Translations not matching locale

Currently, `usePlatformTranslations()` logs a warning when platform locale differs from app locale. Full implementation would require using `createTranslator` from next-intl core library.

## Future Enhancements

1. **Full Translation Override**: Implement `createTranslator` to support true dual-locale translations
2. **Locale Switching**: Add UI to switch between app and platform locales
3. **Locale Persistence**: Store user's preferred locales in cookies/localStorage
4. **Locale Validation**: Add middleware validation for platform locale paths
5. **Type Safety**: Enhance TypeScript types for locale-specific routes
