import { CoachingSessionSchema, TCoachingSession } from '../src/coaching-session'
import { describe, it, expect } from 'vitest'

describe('coaching session', () => {

    it('should validate coaching session', () => {
        const validCoachingSession: TCoachingSession = {
            startTime: '2021-09-30T12:00:00.000Z',
            endTime: '2021-09-30T13:00:00.000Z',
        }
        expect(CoachingSessionSchema.safeParse(validCoachingSession).success).toBe(true)
    });

    it('should invalidate a coaching session with missing required fields', () => {
        const invalidCoachingSession = {
            startTime: '2021-09-30T12:00:00.000Z',
            // Missing 'endTime'
        }
        expect(CoachingSessionSchema.safeParse(invalidCoachingSession).success).toBe(false)
    });

    it('should invalidate a coaching session with an invalid time', () => {
        const invalidCoachingSession = {
            startTime: 'This time is invalid',
            endTime: '2021-09-30T13:00:00.000Z',
        }
        expect(CoachingSessionSchema.safeParse(invalidCoachingSession).success).toBe(false)
    });

});