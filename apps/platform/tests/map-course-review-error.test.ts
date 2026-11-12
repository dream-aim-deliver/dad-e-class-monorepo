import { describe, it, expect } from 'vitest';
import { mapCourseReviewErrorMessage } from '../src/lib/infrastructure/client/utils/map-course-review-error';

const hints = {
  courseNotStarted: 'Start the course to rate it.',
  notEnrolled: 'Enroll in this course to rate it.',
  fallback: 'Failed to submit review.',
};

describe('mapCourseReviewErrorMessage', () => {
  it('maps course_not_started', () => {
    expect(
      mapCourseReviewErrorMessage(
        { message: 'course_not_started', data: { errorType: 'course_not_started' } },
        hints,
      ),
    ).toBe(hints.courseNotStarted);
  });

  it('maps must be started wording', () => {
    expect(
      mapCourseReviewErrorMessage(
        { message: "Course 'foo' must be started before reviewing" },
        hints,
      ),
    ).toBe(hints.courseNotStarted);
  });

  it('maps user_not_enrolled', () => {
    expect(
      mapCourseReviewErrorMessage(
        { message: 'User is not enrolled in course' },
        hints,
      ),
    ).toBe(hints.notEnrolled);
  });

  it('falls back to message or fallback', () => {
    expect(
      mapCourseReviewErrorMessage({ message: 'Something else went wrong' }, hints),
    ).toBe('Something else went wrong');
    expect(mapCourseReviewErrorMessage({}, hints)).toBe(hints.fallback);
  });
});
