'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { ThemeProvider } from '@maany_shr/e-class-ui-kit';
import { getQueryClient } from '../../common/utils/get-query-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { getClientTRPCUrl, trpc } from '../trpc/client';
import { httpBatchLink } from '@trpc/client';
import superjson from 'superjson';

interface ProvidersProps {
    children: ReactNode;
}

export default function ClientProviders({ children }: ProvidersProps) {
    const queryClient = getQueryClient();
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    transformer: superjson,
                    url: getClientTRPCUrl(),
                }),
            ],
        }),
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
