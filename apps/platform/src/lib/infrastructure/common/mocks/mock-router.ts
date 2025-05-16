import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

export const mockRouter = t.router({
    getSkills: t.procedure.query(async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return ['JavaScript', 'TypeScript', 'React', 'GraphQL', 'Node.js'];
    }),
});

export type MockRouter = typeof mockRouter;

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
