import { getPlatform } from './procedures/platform';
import { t } from './trpc-setup';
import { listLanguages } from './procedures/language';
import { getHomePage } from './procedures/home-page';
import { getTopics } from './procedures/topic';
import { getOffersPageOutline } from './procedures/offers-page-outline';
import { getTopicsByCategory } from './procedures/topics-by-category';
import { getCourses } from './procedures/course';
import { getOffersPagePackages } from './procedures/packages';

export const mockRouter = t.router({
    getPlatform,
    listLanguages,
    getHomePage,
    getTopics,
    getOffersPageOutline,
    getTopicsByCategory,
    getCourses,
    getOffersPagePackages,
});

export type MockRouter = typeof mockRouter;
