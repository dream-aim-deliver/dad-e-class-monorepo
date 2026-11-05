/**
 * Maps createCourseReview API failures to localized hint text.
 * Backend (cms #711) returns COURSE_NOT_STARTED / course_not_started when progress is 0.
 */
export function mapCourseReviewErrorMessage(
  error: unknown,
  hints: {
    courseNotStarted: string;
    notEnrolled: string;
    fallback: string;
  },
): string {
  const haystack = serializeError(error).toLowerCase();

  if (
    haystack.includes('course_not_started') ||
    haystack.includes('course not started') ||
    haystack.includes('must be started before reviewing')
  ) {
    return hints.courseNotStarted;
  }

  if (
    haystack.includes('user_not_enrolled') ||
    haystack.includes('not enrolled') ||
    haystack.includes('must be enrolled')
  ) {
    return hints.notEnrolled;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string' && message.trim().length > 0) {
      return message;
    }
  }

  return hints.fallback;
}

function serializeError(error: unknown): string {
  if (typeof error === 'string') return error;
  if (!error || typeof error !== 'object') return '';
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}
