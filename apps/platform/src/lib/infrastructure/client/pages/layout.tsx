'use client';

import Header from './header';
import Footer from './footer';
import { useMemo, useEffect, useRef, useState } from 'react';
import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale } from 'next-intl';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useRequiredPlatform } from '../context/platform-context';
import { ImageProvider } from '@maany_shr/e-class-ui-kit';
import { OptimizedImage } from '../components/optimized-image';
import { PlatformWorkspaceSidebarPanel } from './layouts/platform-workspace-sidebar-panel';

interface LayoutProps {
    children: React.ReactNode;
    availableLocales: TLocale[];
}

export default function Layout({ children, availableLocales }: LayoutProps) {
    const locale = useLocale() as TLocale;
    const sessionDTO = useSession();
    const session = sessionDTO.data;
    const pathname = usePathname();
    const [isMobileWorkspaceSidebarOpen, setIsMobileWorkspaceSidebarOpen] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const isInitialMount = useRef(true);

    // Trigger animation on route change (but not on initial mount)
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        if (contentRef.current) {
            // Remove animation class
            contentRef.current.classList.remove('page-content-entrance');
            // Force reflow
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            contentRef.current.offsetHeight;
            // Re-add animation class
            contentRef.current.classList.add('page-content-entrance');
        }
    }, [pathname]);

    useEffect(() => {
        setIsMobileWorkspaceSidebarOpen(false);
    }, [pathname]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 1024px)');

        const handleMediaQueryChange = (event: MediaQueryListEvent) => {
            if (event.matches) {
                setIsMobileWorkspaceSidebarOpen(false);
            }
        };

        if (mediaQuery.matches) {
            setIsMobileWorkspaceSidebarOpen(false);
        }

        mediaQuery.addEventListener('change', handleMediaQueryChange);

        return () => {
            mediaQuery.removeEventListener('change', handleMediaQueryChange);
        };
    }, []);

    // Get platform data from context (already fetched server-side with 15-minute cache)
    const { platform } = useRequiredPlatform();

    // Cache platform info for loading pages (they render before context is available)
    useEffect(() => {
        try {
            localStorage.setItem('platform-loading-info', JSON.stringify({
                name: platform.name,
                logoUrl: platform.logo?.downloadUrl || null
            }));
        } catch {
            // Ignore localStorage errors (SSR, private browsing, etc.)
        }
    }, [platform.name, platform.logo?.downloadUrl]);

    // Transform platform data to view model format
    // Since platform comes from required context (throws if missing) and is already
    // validated server-side, we can safely construct the 'default' mode view model
    const platformViewModel = useMemo(() => ({
        mode: 'default' as const,
        data: platform,
    }), [platform]);

    const platformWorkspaceUserRole = useMemo(() => {
        if (session?.user.roles?.includes('admin')) {
            return 'admin' as const;
        }

        if (session?.user.roles?.includes('course_creator')) {
            return 'courseCreator' as const;
        }

        if (session?.user.roles?.includes('coach')) {
            return 'coach' as const;
        }

        if (session?.user.roles?.includes('student')) {
            return 'student' as const;
        }

        return 'student' as const;
    }, [session?.user.roles]);

    return (
        <ImageProvider value={OptimizedImage}>
            <div
                className="w-full min-h-screen bg-repeat-y flex flex-col justify-center items-center"
                style={{
                    // Temporary linear gradient to match the Figma. Should be uploaded this dark.
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${platformViewModel.data.backgroundImage?.downloadUrl ?? ''})`,
                    backgroundSize: '100% auto',
                    // TODO: have a fallback color
                    backgroundColor: 'var(--color-base-neutral-950, #141414)',
                }}
            >
                <Header
                    platformViewModel={platformViewModel}
                    availableLocales={availableLocales}
                    locale={locale}
                    session={session}
                    onMobileWorkspaceTriggerClick={
                        session ? () => setIsMobileWorkspaceSidebarOpen(true) : undefined
                    }
                />
                {session && isMobileWorkspaceSidebarOpen && (
                    <PlatformWorkspaceSidebarPanel
                        mode="mobileOverlay"
                        locale={locale}
                        userName={session.user.name || 'Your Majesty'}
                        userRole={platformWorkspaceUserRole}
                        profileImageUrl={session.user.image}
                        rating={{ score: 4.5, count: 10 }}
                        onClose={() => setIsMobileWorkspaceSidebarOpen(false)}
                    />
                )}
                <main className="flex-grow w-full mx-auto pb-25 justify-center items-center">
                    <div ref={contentRef} className="page-content-entrance w-full">
                        {children}
                    </div>
                </main>
                <Footer
                    locale={locale}
                    availableLocales={availableLocales}
                    platformViewModel={platformViewModel}
                />
            </div>
        </ImageProvider>
    );
}
