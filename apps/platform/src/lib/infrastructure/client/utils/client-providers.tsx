'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { createContext, ReactNode, useContext, useState } from 'react';
import { ThemeProvider } from '@maany_shr/e-class-ui-kit';
import {
    getQueryClient,
    getTRPCUrl,
} from '../../common/utils/get-query-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { trpc } from '../trpc/client';
import { httpBatchLink } from '@trpc/client';
import { language } from '@maany_shr/e-class-models';
import superjson from 'superjson';

interface ClientProvidersProps {
    children: ReactNode;
    initialPlatformLanguageId: string | number;
}

const PlatformLanguageContext = createContext<
    language.TPlatformLanguageId | undefined
>(undefined);

export default function ClientProviders({
    children,
    initialPlatformLanguageId,
}: ClientProvidersProps) {
    const queryClient = getQueryClient();
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    transformer: superjson,
                    url: getTRPCUrl(),
                }),
            ],
        }),
    );
    const [platformLanguageId] = useState(initialPlatformLanguageId);

    return (
        <PlatformLanguageContext.Provider value={platformLanguageId}>
            <ThemeProvider>
                <trpc.Provider client={trpcClient} queryClient={queryClient}>
                    <QueryClientProvider client={queryClient}>
                        {children}
                        {process.env.NODE_ENV === 'development' && (
                            <ReactQueryDevtools />
                        )}
                    </QueryClientProvider>
                </trpc.Provider>
            </ThemeProvider>
        </PlatformLanguageContext.Provider>
    );
}

export function usePlatformLanguage(): language.TPlatformLanguageId {
    const context = useContext(PlatformLanguageContext);

    if (context === undefined) {
        throw new Error(
            'usePlatformLanguage must be used within a PlatformLanguageProvider',
        );
    }

    return context;
}
