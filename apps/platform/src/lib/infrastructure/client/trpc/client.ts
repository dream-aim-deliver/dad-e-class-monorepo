import { TAppRouter } from '@dream-aim-deliver/e-class-cms-rest';
import { createTRPCReact } from '@trpc/react-query';
import type { CreateTRPCReact } from '@trpc/react-query';

export const trpc: CreateTRPCReact<TAppRouter, unknown> = createTRPCReact<TAppRouter>();
