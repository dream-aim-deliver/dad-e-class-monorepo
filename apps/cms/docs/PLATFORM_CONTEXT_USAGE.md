# Platform Context Usage Guide

The `PlatformProvider` and `usePlatform` hook allow you to access platform data throughout your platform-scoped pages.

## Overview

The platform data is fetched once in the [layout.tsx](../src/app/[locale]/(wired-pages)/(platform-management)/platform/[platform_slug]/[platform_locale]/layout.tsx) and made available to all child pages and components via React Context.

## Provider Setup

The provider is already configured in the layout:

```tsx
// In layout.tsx
import type { TGetPlatformUseCaseResponse } from '@dream-aim-deliver/e-class-cms-rest';

const trpc = getServerTRPC({ platform_slug, platform_locale });
const queryClient = getQueryClient();
// @ts-expect-error - fetchQuery returns unknown, but we know the type from TRPC router
const platformResult: TGetPlatformUseCaseResponse = await queryClient.fetchQuery(
    trpc.getPlatform.queryOptions({})
);

if (!platformResult.success) {
    throw new Error('Failed to load platform data');
}

return (
    <PlatformProvider platform={platformResult.data}>
        {/* Your nested routes */}
    </PlatformProvider>
);
```

## Using Platform Data in Components

### Client Components

```tsx
'use client';

import { usePlatform, useRequiredPlatform } from '@/lib/infrastructure/client/context/platform-context';

// Option 1: Safe access (returns null if outside provider)
function MyComponent() {
    const platformContext = usePlatform();

    if (!platformContext) {
        return <div>No platform context available</div>;
    }

    return (
        <div>
            <h1>{platformContext.platform.name}</h1>
            {platformContext.platform.logoUrl && (
                <img src={platformContext.platform.logoUrl} alt="Platform logo" />
            )}
        </div>
    );
}

// Option 2: Required access (throws if outside provider)
function MyOtherComponent() {
    const { platform } = useRequiredPlatform();

    return (
        <div>
            <h1>{platform.name}</h1>
            <p>Background: {platform.backgroundImageUrl}</p>
            {/* Access to all platform fields */}
        </div>
    );
}
```

### Available Platform Fields

The platform object contains:

- `id`: Platform ID (number)
- `name`: Platform name (string)
- `logoUrl`: Logo URL (string | null)
- `backgroundImageUrl`: Background image URL (string | null)
- `footerContent`: Footer rich text content

See the `TGetPlatformSuccessResponse['data']` type from `@dream-aim-deliver/e-class-cms-rest` for the complete type definition.

## When to Use

Use the `usePlatform` hook when you need to:

- Display platform branding (logo, name, background)
- Access platform-specific configuration
- Customize UI based on platform settings
- Show platform footer content

## Related Contexts

- **PlatformLocaleProvider**: Provides `platformSlug` and `platformLocale` (the content language)
- **PlatformProvider**: Provides full platform data (name, logo, etc.)
- **next-intl**: Provides app UI locale (separate from platform content locale)

See [DUAL_LOCALE_GUIDE.md](./DUAL_LOCALE_GUIDE.md) for more information about the dual locale system.
