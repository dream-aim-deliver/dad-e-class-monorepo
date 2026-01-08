import { getPlatform } from './procedures/platform';
import { t } from './trpc-setup';
import { listLanguages } from './procedures/language';
import { getHomePage } from './procedures/home-page';
import { listTopics } from './procedures/topic';
import {
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
import { listLessonComponents } from './procedures/lesson-components';
import { saveCourseStructure } from './procedures/course-structure';
import { uploadLessonComponentFile } from './procedures/lesson-component-file';
import { saveLessonComponents } from './procedures/lesson-components';
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
import { listCourseMaterials } from './procedures/course-materials';
import { listStudentNotes } from './procedures/course-notes';
import { listCourseGroups, registerCoachToGroup } from './procedures/course-groups';
import { getPublicCourseDetails } from './procedures/get-public-course-detail';
import { listCourseReviews } from './procedures/course-reviews';
import { getCoursePackages } from './procedures/course-packages';
import { getCoachAvailability } from './procedures/coach-availability';
import { scheduleCoachingSession } from './procedures/schedule-coaching-session';
import { requestCoachingSession } from './procedures/request-coaching-session';
import { addAvailability, deleteAvailability } from './procedures/availability';
import { listStudentCoachingSessions } from './procedures/student-coaching-sessions';
import { createCoachingSessionReview } from './procedures/create-coaching-session-review';
import { unscheduleCoachingSession } from './procedures/unschedule-coaching-session';
import { listUpcomingStudentCoachingSessions } from './procedures/upcoming-student-coaching-sessions';
import { createNotification } from './procedures/create-notification';
import { getAssignment } from './procedures/assignment';
import { sendAssignmentReply } from './procedures/assignment-reply';
import { passAssignment } from './procedures/assignment';
import { getStudentDetails } from './procedures/student-details';
import { getStudentCoachingSession } from './procedures/student-coaching-session';
import { listGroupCoachingSessions, listCoachCoachingSessions, createGroupCoachingSession } from './procedures/group-coaching-sessions';

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
    getCoachingPage,
    listCoachingOfferings,
    listAvailableCoachings,
    getCourseAccess,
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
    listLessonComponents,
    saveCourseStructure,
    uploadLessonComponentFile,
    saveLessonComponents,
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
    listCourseMaterials,
    listStudentNotes,
    listCourseGroups,
    registerCoachToGroup,
    getPublicCourseDetails,
    listCourseReviews,
    getCoursePackages,
    getCoachAvailability,
    scheduleCoachingSession,
    requestCoachingSession,
    addAvailability,
    listStudentCoachingSessions,
    createCoachingSessionReview,
    unscheduleCoachingSession,
    listUpcomingStudentCoachingSessions,
    createNotification,
    getAssignment,
    sendAssignmentReply,
    passAssignment,
    deleteAvailability,
    getStudentDetails,
    getStudentCoachingSession,
    listGroupCoachingSessions,
    listCoachCoachingSessions,
    createGroupCoachingSession,
});

export type MockRouter = typeof mockRouter;
