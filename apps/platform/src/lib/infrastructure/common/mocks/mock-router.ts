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
import { getCourseAccess } from './procedures/course-access';
import { listAssessmentComponents } from './procedures/assessment-components';
import { submitAssessmentProgress } from './procedures/assessment-progress';
import { getEnrolledCourseDetails } from './procedures/enrolled-course-details';
import { getStudentProgress } from './procedures/student-progress';
import { listIncludedCoachingSessions } from './procedures/included-coaching-sessions';
import { getCourseIntroduction } from './procedures/course-introduction';
import { getCourseOutline } from './procedures/course-outline';
import { listAssessmentProgresses } from './procedures/assessment-progresses';
import { listUserCourses } from './procedures/user-courses';
import { searchCourses } from './procedures/courses';
import { createCourse } from './procedures/create-course';
import { getCourseShort } from './procedures/course-short';
import { uploadCourseImage, verifyFile } from './procedures/course-image';
import { getCourseStructure } from './procedures/course-structure';
import { listLessonComponents } from './procedures/lesson-components';
import { saveCourseStructure } from './procedures/course-structure';

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
    getCourseAccess,
    listAssessmentComponents,
    submitAssessmentProgress,
    getEnrolledCourseDetails,
    getStudentProgress,
    listIncludedCoachingSessions,
    getCourseIntroduction,
    getCourseOutline,
    listAssessmentProgresses,
    listUserCourses,
    searchCourses,
    uploadCourseImage,
    verifyFile,
    createCourse,
    getCourseShort,
    getCourseStructure,
    listLessonComponents,
    saveCourseStructure,
});

export type MockRouter = typeof mockRouter;
