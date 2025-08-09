'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useMemo } from 'react';
import { ThemeProvider } from '@maany_shr/e-class-ui-kit';
import {
    getQueryClient,
    getTRPCUrl,
} from '../../common/utils/get-cms-query-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { trpc } from '../trpc/client';
import { httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';

interface ClientProvidersProps {
    children: ReactNode;
}

export default function CMSTRPCClientProviders({ children }: ClientProvidersProps) {
    const queryClient = getQueryClient();
    const { data: session } = useSession();
    const locale = useLocale();

    const trpcClient = useMemo(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    transformer: superjson,
                    url: getTRPCUrl(),
                    headers() {
                        const headers: Record<string, string> = {};

                        // Add authorization header if session has ID token
                        if (session?.user?.idToken) {
                            headers['Authorization'] = `Bearer ${session.user.idToken}`;
                        }

                        // Add locale header
                        if (locale) {
                            headers['Accept-Language'] = locale;
                        }

                        return headers;
                    },
                }),
            ],
        }),
        [session?.user?.idToken, locale] // Recreate client when session or locale changes
    );

    return (
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
    );
}
