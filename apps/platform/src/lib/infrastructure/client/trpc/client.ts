import { MockRouter } from '../../common/mocks/mock-router';
import { createTRPCReact } from '@trpc/react-query';

export const trpc = createTRPCReact<MockRouter>();