import { getPlatform } from './procedures/platform';
import { t } from './trpc-setup';
import { listLanguages } from './procedures/language';
import { getHomePage } from './procedures/home-page';
import { listTopics } from './procedures/topic';
import {
    getOffersPageCarousel,
    getOffersPageOutline,
} from './procedures/offers-page';
import { listTopicsByCategory } from './procedures/topics-by-category';
import { listCourses } from './procedures/course';
import { listOffersPagePackages } from './procedures/package';
import { listCoaches } from './procedures/coach';
import { getCoachingPage } from './procedures/coachings-page';
import { listCoachingOfferings } from './procedures/coaching-offering';
import { listAvailableCoachings } from './procedures/available-coachings';

export const mockRouter = t.router({
    getPlatform,
    listLanguages,
    getHomePage,
    listTopics,
    getOffersPageOutline,
    getOffersPageCarousel,
    listTopicsByCategory,
    listCourses,
    listOffersPagePackages,
    listCoaches,
    getCoachingPage,
    listCoachingOfferings,
    listAvailableCoachings,
});

export type MockRouter = typeof mockRouter;
