import { describe, it, expect } from 'vitest';
import { videoSecondsToMinutes, formatVideoDuration, formatCompactDuration } from '../lib/utils/video-duration';

const labels = { hour: 'hour', hours: 'hours', minute: 'minute', minutes: 'minutes' };

describe('videoSecondsToMinutes', () => {
    it('returns 0 for 0', () => {
        expect(videoSecondsToMinutes(0)).toBe(0);
    });

    it('returns 0 for null', () => {
        expect(videoSecondsToMinutes(null)).toBe(0);
    });

    it('returns 0 for undefined', () => {
        expect(videoSecondsToMinutes(undefined)).toBe(0);
    });

    it('returns 0 for negative values', () => {
        expect(videoSecondsToMinutes(-60)).toBe(0);
    });

    it('converts 60 seconds to 1 minute', () => {
        expect(videoSecondsToMinutes(60)).toBe(1);
    });

    it('rounds 90 seconds to 2 minutes', () => {
        expect(videoSecondsToMinutes(90)).toBe(2);
    });

    it('converts 757 seconds to 13 minutes (not 12 hours 37 minutes)', () => {
        expect(videoSecondsToMinutes(757)).toBe(13);
    });

    it('converts 300 seconds to 5 minutes', () => {
        expect(videoSecondsToMinutes(300)).toBe(5);
    });
});

describe('formatVideoDuration', () => {
    it('formats 0 minutes as "0 minutes"', () => {
        expect(formatVideoDuration(0, labels)).toBe('0 minutes');
    });

    it('formats 1 minute as "1 minute" (singular)', () => {
        expect(formatVideoDuration(1, labels)).toBe('1 minute');
    });

    it('formats 5 minutes as "5 minutes"', () => {
        expect(formatVideoDuration(5, labels)).toBe('5 minutes');
    });

    it('formats 59 minutes as "59 minutes"', () => {
        expect(formatVideoDuration(59, labels)).toBe('59 minutes');
    });

    it('formats 60 minutes as "1 hour" (singular, no minutes when 0)', () => {
        expect(formatVideoDuration(60, labels)).toBe('1 hour');
    });

    it('formats 61 minutes as "1 hour 1 minute" (both singular)', () => {
        expect(formatVideoDuration(61, labels)).toBe('1 hour 1 minute');
    });

    it('formats 62 minutes as "1 hour 2 minutes"', () => {
        expect(formatVideoDuration(62, labels)).toBe('1 hour 2 minutes');
    });

    it('formats 13 minutes (757 seconds rounded) as "13 minutes"', () => {
        expect(formatVideoDuration(videoSecondsToMinutes(757), labels)).toBe('13 minutes');
    });

    it('formats 120 minutes as "2 hours"', () => {
        expect(formatVideoDuration(120, labels)).toBe('2 hours');
    });

    it('formats 90 minutes as "1 hour 30 minutes"', () => {
        expect(formatVideoDuration(90, labels)).toBe('1 hour 30 minutes');
    });
});

describe('formatCompactDuration', () => {
    it('formats 0 minutes as "0m"', () => {
        expect(formatCompactDuration(0)).toBe('0m');
    });

    it('formats negative minutes as "0m"', () => {
        expect(formatCompactDuration(-10)).toBe('0m');
    });

    it('formats 5 minutes as "5m"', () => {
        expect(formatCompactDuration(5)).toBe('5m');
    });

    it('formats 59 minutes as "59m"', () => {
        expect(formatCompactDuration(59)).toBe('59m');
    });

    it('formats 60 minutes as "1h" (no trailing 0m)', () => {
        expect(formatCompactDuration(60)).toBe('1h');
    });

    it('formats 90 minutes as "1h 30m"', () => {
        expect(formatCompactDuration(90)).toBe('1h 30m');
    });

    it('formats 120 minutes as "2h"', () => {
        expect(formatCompactDuration(120)).toBe('2h');
    });

    it('formats 125 minutes as "2h 5m"', () => {
        expect(formatCompactDuration(125)).toBe('2h 5m');
    });
});
