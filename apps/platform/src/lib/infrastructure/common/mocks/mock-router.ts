import { getPlatform } from './procedures/platform';
import { t } from './trpc-setup';

export const mockRouter = t.router({
    getSkills: t.procedure.query(async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return ['JavaScript', 'TypeScript', 'React', 'GraphQL', 'Node.js'];
    }),
    getPlatform,
});

export type MockRouter = typeof mockRouter;
