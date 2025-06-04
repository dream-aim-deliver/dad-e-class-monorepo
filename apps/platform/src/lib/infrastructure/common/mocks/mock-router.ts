import { getPlatform } from './procedures/platform';
import { t } from './trpc-setup';
import { listLanguages } from './procedures/language';
import { getHomePage, getHomePageTopics } from './procedures/home-page';

export const mockRouter = t.router({
    getPlatform,
    listLanguages,
    getHomePage,
    getHomePageTopics,
});

export type MockRouter = typeof mockRouter;
