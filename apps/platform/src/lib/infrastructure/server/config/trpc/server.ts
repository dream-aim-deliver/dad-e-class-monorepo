import 'server-only';
import {
    createCallerFactory,
    MockRouter,
    mockRouter,
} from '../../../common/mocks/mock-router';
import { createHydrationHelpers } from '@trpc/react-query/rsc';
import { makeQueryClient } from '../../../common/utils/get-query-client';
import { cache } from 'react';

export const getQueryClient = cache(makeQueryClient);
const caller = createCallerFactory(mockRouter)({});
export const { trpc, HydrateClient } = createHydrationHelpers<MockRouter>(
    caller,
    getQueryClient,
);
