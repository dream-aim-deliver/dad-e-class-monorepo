'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { ThemeProvider } from '@maany_shr/e-class-ui-kit';
import {
    getQueryClient,
    getTRPCUrl,
} from '../../common/utils/get-query-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { trpc } from './client';
import { httpBatchLink } from '@trpc/client';
import superjson from 'superjson';

interface ClientProvidersProps {
    children: ReactNode;
    defaultTheme?: 'just-do-ad' | 'job-brand-me' | 'bewerbeagentur' | 'cms';
}

export default function MockTRPCClientProviders({
    children,
    defaultTheme = 'just-do-ad',
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

    return (
        <ThemeProvider defaultTheme={defaultTheme}>
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
