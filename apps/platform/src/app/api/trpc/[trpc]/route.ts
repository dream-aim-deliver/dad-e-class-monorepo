import { mockRouter } from '../../../../lib/infrastructure/common/mocks/mock-router';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

export async function GET(req: Request) {
    return fetchRequestHandler({
        endpoint: '/api/trpc',
        req,
        router: mockRouter,
        createContext: () => ({}),
    });
}

export async function POST(req: Request) {
    return fetchRequestHandler({
        endpoint: '/api/trpc',
        req,
        router: mockRouter,
        createContext: () => ({}),
    });
}
