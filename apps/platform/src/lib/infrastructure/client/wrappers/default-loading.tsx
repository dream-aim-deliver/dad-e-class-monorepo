'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import { DefaultLoading } from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface CachedPlatformInfo {
    name: string;
    logoUrl: string | null;
}

export default function DefaultLoadingWrapper() {
    const locale = useLocale() as TLocale;
    const [platformInfo, setPlatformInfo] = useState<CachedPlatformInfo | null>(null);

    useEffect(() => {
        // Read cached platform info from localStorage
        try {
            const cached = localStorage.getItem('platform-loading-info');
            if (cached) {
                setPlatformInfo(JSON.parse(cached));
            }
        } catch {
            // Ignore localStorage errors (SSR, private browsing, etc.)
        }
    }, []);

    // Create logo element using same pattern as header
    const logo = platformInfo ? (
        platformInfo.logoUrl ? (
            <Image
                src={platformInfo.logoUrl}
                alt={platformInfo.name}
                width={48}
                height={48}
                className="w-auto h-12"
            />
        ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-600">
                    {platformInfo.name[0]?.toUpperCase() || 'P'}
                </span>
            </div>
        )
    ) : null;

    return <DefaultLoading locale={locale} variant="minimal" logo={logo} />;
}
