'use client';

import { SessionMonitorWithModal } from '@maany_shr/e-class-auth';
import {
    UnsavedChangesProvider,
    useUnsavedChanges,
    SessionExpirationModal,
} from '@maany_shr/e-class-ui-kit';
import { TLocale } from '@maany_shr/e-class-translations';

interface SessionMonitorWrapperProps {
    children: React.ReactNode;
    locale: TLocale;
}

/**
 * Wrapper component that provides session monitoring and unsaved changes tracking
 * for the CMS application.
 *
 * This component:
 * - Wraps children with UnsavedChangesProvider
 * - Includes SessionMonitorWithModal for auto-logout functionality
 * - Checks for unsaved changes before logout
 */
export function SessionMonitorWrapper({ children, locale }: SessionMonitorWrapperProps) {
    return (
        <UnsavedChangesProvider>
            <SessionMonitorWithModal
                locale={locale}
                SessionExpirationModal={SessionExpirationModal}
                useUnsavedChanges={useUnsavedChanges}
                checkInterval={60000} // Check every 60 seconds
                debug={process.env.NODE_ENV === 'development'}
            />
            {children}
        </UnsavedChangesProvider>
    );
}
