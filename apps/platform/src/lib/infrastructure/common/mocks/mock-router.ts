import { getPlatform } from './procedures/platform';
import { t } from './trpc-setup';
import { listLanguages } from './procedures/language';
import { getHomePage } from './procedures/home-page';
import { getTopics } from './procedures/topic';
import { getOffersPageOutline } from './procedures/offers-page-outline';

export const mockRouter = t.router({
    getPlatform,
    listLanguages,
    getHomePage,
    getTopics,
    getOffersPageOutline,
});

export type MockRouter = typeof mockRouter;
