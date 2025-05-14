import { useMemo } from 'react';
import { MockedTrpcClient } from '../mocks/trpc-mocks';

export const useTRPC = () => {
    const client = useMemo(() => {
        // Initialize your TRPC client here
        return MockedTrpcClient;
    }, []);

    return client;
};