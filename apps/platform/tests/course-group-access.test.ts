import { describe, expect, it } from 'vitest';
import {
    canAccessCoachGroupWorkspace,
    hasCourseGroupManagerRole,
    isCourseGroupManagerRole,
} from '../src/lib/infrastructure/common/utils/course-group-access';

describe('course-group-access', () => {
    it('recognizes manager roles', () => {
        expect(isCourseGroupManagerRole('superadmin')).toBe(true);
        expect(isCourseGroupManagerRole('admin')).toBe(true);
        expect(isCourseGroupManagerRole('course_creator')).toBe(true);
        expect(isCourseGroupManagerRole('coach')).toBe(false);
        expect(isCourseGroupManagerRole('student')).toBe(false);
    });

    it('detects manager role in a roles array', () => {
        expect(hasCourseGroupManagerRole(['superadmin'])).toBe(true);
        expect(hasCourseGroupManagerRole(['student', 'admin'])).toBe(true);
        expect(hasCourseGroupManagerRole(['coach'])).toBe(false);
        expect(hasCourseGroupManagerRole([])).toBe(false);
        expect(hasCourseGroupManagerRole(undefined)).toBe(false);
    });

    it('allows coach workspace for coaches and managers', () => {
        expect(canAccessCoachGroupWorkspace(['coach'])).toBe(true);
        expect(canAccessCoachGroupWorkspace(['superadmin'])).toBe(true);
        expect(canAccessCoachGroupWorkspace(['admin'])).toBe(true);
        expect(canAccessCoachGroupWorkspace(['course_creator'])).toBe(true);
        expect(canAccessCoachGroupWorkspace(['student'])).toBe(false);
        expect(canAccessCoachGroupWorkspace(undefined)).toBe(false);
    });
});
