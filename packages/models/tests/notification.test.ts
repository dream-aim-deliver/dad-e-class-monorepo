import { NotificationSchema, TNotification } from '../src/notification';
import { describe, it, expect } from 'vitest';


describe('notification', () => {

    it('should validate notification', () => {
        const validNotification: TNotification = {
            message: 'Hello, World!',
            action: { title: 'View', url: 'https://example.com' },
            timestamp: '2021-09-30T12:00:00.000Z',
            isRead: false,
        };
        expect(NotificationSchema.safeParse(validNotification).success).toBe(true);
    });

    it('should invalidate a notification with missing required fields', () => {
        const invalidNotification = {
            message: 'Hello, World!',
            action: { title: 'View', url: 'https://example.com' },
            // Missing 'timestamp'
            isRead: false,
        };
        expect(NotificationSchema.safeParse(invalidNotification).success).toBe(false);
    });

    it('should invalidate a notification with a timezone without offset', () => {
        const invalidNotification = {
            message: 'Hello, World!',
            action: { title: 'View', url: 'https://example.com' },
            timestamp: '2021-09-30T12:00:00.000',
            isRead: false,
        };
        expect(NotificationSchema.safeParse(invalidNotification).success).toBe(false);
    });

});