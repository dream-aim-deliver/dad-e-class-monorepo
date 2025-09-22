import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../../../../../../../cms/src/lib/infrastructure/common/mocks/trpc-setup';

export const createNotification = t.procedure
    .input(useCaseModels.CreateNotificationRequestSchema)
    .mutation<useCaseModels.TCreateNotificationUseCaseResponse>((opts) => {
        const { message, actionTitle, actionUrl, senderId, receiverId } = opts.input;

        // Mock logic: Create a notification
        // In a real app, this would call the backend
        const mockNotification: useCaseModels.TCreateNotificationSuccessResponse['data']['notification'] = {
            id: Math.floor(Math.random() * 10000),
            message,
            action: actionTitle && actionUrl ? { title: actionTitle, url: actionUrl } : null,
            timestamp: new Date().toISOString(),
            isRead: false,
        };

        return {
            success: true,
            data: {
                notification: mockNotification,
            },
        };
    });
