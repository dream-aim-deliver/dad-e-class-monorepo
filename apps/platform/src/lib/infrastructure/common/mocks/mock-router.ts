import { getPlatform } from './procedures/platform';
import { t } from './trpc-setup';
import { listLanguages } from './procedures/language';

export const mockRouter = t.router({
    getSkills: t.procedure.query(async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return ['JavaScript', 'TypeScript', 'React', 'GraphQL', 'Node.js'];
    }),
    getPlatform,
    listLanguages,
});

export type MockRouter = typeof mockRouter;
