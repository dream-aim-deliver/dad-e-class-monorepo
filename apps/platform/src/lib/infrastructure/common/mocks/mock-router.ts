import { getPlatform } from './procedures/platform';
import { t } from './trpc-setup';
import { listLanguages } from './procedures/language';
import { getHomePage } from './procedures/home-page';

export const mockRouter = t.router({
    getPlatform,
    listLanguages,
    getHomePage,
});

export type MockRouter = typeof mockRouter;
