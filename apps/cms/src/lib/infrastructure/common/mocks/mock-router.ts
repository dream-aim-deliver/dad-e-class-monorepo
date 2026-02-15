import { getPlatform } from './procedures/platform';
import { t } from './trpc-setup';
import { getHomePage } from './procedures/home-page';
import { listTopics } from './procedures/topic';
import { listTopicsByCategory } from './procedures/topics-by-category';
import { listCourses } from './procedures/course';
import { listCoaches } from './procedures/coach';
import { getCoachingPage } from './procedures/coachings-page';
import { listCoachingOfferings } from './procedures/coaching-offering';
import { listAvailableCoachings } from './procedures/available-coachings';
import { listAssessmentComponents } from './procedures/assessment-components';
import { submitAssessmentProgress } from './procedures/assessment-progress';
import { getStudentProgress } from './procedures/student-progress';
import { listIncludedCoachingSessions } from './procedures/included-coaching-sessions';
import {
    getCourseOutline,
    saveCourseOutline,
} from './procedures/course-outline';
import { listAssessmentProgresses } from './procedures/assessment-progresses';
import { searchCourses } from './procedures/courses';
import { createCourse } from './procedures/create-course';
import { getCourseShort } from './procedures/course-short';
import { uploadCourseImage, getDownloadUrl } from './procedures/course-image';
import { getCourseStructure } from './procedures/course-structure';
import { saveCourseStructure } from './procedures/course-structure';
import { uploadLessonComponentFile } from './procedures/lesson-component-file';
import { saveCourseDetails } from './procedures/course-details';
import { uploadIntroductionVideo } from './procedures/introduction-video';
import { uploadAccordionIcon } from './procedures/accordion-icon';
import { getPlatformLanguage } from './procedures/platform-language';
import { togglePreCourseAssessment } from './procedures/pre-course-assessment';
import { saveAssessmentComponents } from './procedures/assessment-components';
import { submitLessonProgresses } from './procedures/lesson-progresses';
import {
    getCourseIntroduction,
    saveCourseIntroduction,
} from './procedures/course-introduction';
import { listCourseStudents } from "./procedures/course-students";
import { uploadLessonProgressFile } from './procedures/lesson-progress-file';

export const mockRouter = t.router({
    getPlatform,
    getHomePage,
    listTopics,
    listTopicsByCategory,
    listCourses,
    listCoaches,
    getCoachingPage,
    listCoachingOfferings,
    listAvailableCoachings,
    listPreCourseAssessmentComponents: listAssessmentComponents,
    submitAssessmentProgress,
    getStudentProgress,
    listIncludedCoachingSessions,
    getCourseIntroduction,
    getCourseOutline,
    listAssessmentProgresses,
    searchCourses,
    uploadCourseImage,
    getDownloadUrl,
    createCourse,
    getCourseShort,
    getCourseStructure,
    saveCourseStructure,
    uploadLessonComponentFile,
    saveCourseDetails,
    uploadIntroductionVideo,
    saveCourseIntroduction,
    uploadAccordionIcon,
    saveCourseOutline,
    getPlatformLanguage,
    togglePreCourseAssessment,
    savePreCourseAssessmentComponents: saveAssessmentComponents,
    listCourseStudents,
    submitLessonProgresses,
    uploadLessonProgressFile,
});

export type MockRouter = typeof mockRouter;
