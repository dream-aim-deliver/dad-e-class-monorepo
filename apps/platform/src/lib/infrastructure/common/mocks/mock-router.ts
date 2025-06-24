import { getPlatform } from './procedures/platform';
import { t } from './trpc-setup';
import { listLanguages } from './procedures/language';
import { getHomePage } from './procedures/home-page';
import { listTopics } from './procedures/topic';
import { getOffersPageOutline } from './procedures/offers-page-outline';
import { listTopicsByCategory } from './procedures/topics-by-category';
import { listCourses } from './procedures/course';
import { listOffersPagePackages } from './procedures/packages';
import { listCoaches } from './procedures/coach';

export const mockRouter = t.router({
    getPlatform,
    listLanguages,
    getHomePage,
    listTopics,
    getOffersPageOutline,
    listTopicsByCategory,
    listCourses,
    listOffersPagePackages,
    listCoaches,
});

export type MockRouter = typeof mockRouter;
