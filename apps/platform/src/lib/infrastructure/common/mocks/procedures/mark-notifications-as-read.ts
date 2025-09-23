import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

export const markNotificationsAsRead = t.procedure
    .input(useCaseModels.MarkNotificationsAsReadRequestSchema)
    .mutation(
        async (opts): Promise<useCaseModels.TMarkNotificationsAsReadUseCaseResponse> => {
            const { notificationIds } = opts.input;
            
            // Mock the marked notifications (in a real implementation, these would be updated in the database)
            const markedNotifications = notificationIds.map((id) => ({
                id,
                message: `Notification ${id} marked as read`,
                action: null,
                timestamp: new Date().toISOString(),
                isRead: true
            }));
            
            return {
                success: true,
                data: {
                    notifications: markedNotifications
                }
            };
        }
    );