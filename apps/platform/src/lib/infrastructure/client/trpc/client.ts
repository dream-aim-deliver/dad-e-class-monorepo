import { MockRouter } from '../../common/mocks/mock-router';
import { createTRPCReact } from '@trpc/react-query';

export function getClientTRPCUrl() {
    const base =
        process.env.NEXT_PUBLIC_E_CLASS_PLATFORM_URL ?? 'http:localhost:3000';
    return `${base}/api/trpc`;
}

export const trpc = createTRPCReact<MockRouter>();
