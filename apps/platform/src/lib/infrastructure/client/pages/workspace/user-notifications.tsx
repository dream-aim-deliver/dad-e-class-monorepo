'use client';

import { useState, useEffect } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useListNotificationsPresenter } from '../../hooks/use-notifications-presenter';
import { useSession } from 'next-auth/react';
import {
    DefaultLoading,
    DefaultError,
} from '@maany_shr/e-class-ui-kit';
import { Activity } from '@maany_shr/e-class-ui-kit';
import { RecentActivity } from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { trpc } from '../../trpc/client';

export default function UserNotifications() {
    const locale = useLocale() as TLocale;
    const sessionDTO = useSession();
    const session = sessionDTO.data;
    
    const [viewModel, setViewModel] = useState<viewModels.TNotificationsViewModel | null>(null);
    const { presenter } = useListNotificationsPresenter(setViewModel);

    // Get a valid user ID
    const getUserId = (): number => {
        if (!session?.user?.id) return 1;
        const parsed = parseInt(String(session.user.id), 10);
        return isNaN(parsed) ? 1 : parsed;
    };

    // TRPC queries
    const [notificationsResponse, { refetch: refetchNotifications }] = trpc.listNotifications.useSuspenseQuery({
        userId: getUserId(),
        pagination: {
            pageSize: 10,
            page: 1
        }
    });

    const markAsReadMutation = trpc.markNotificationsAsRead.useMutation({
        onSuccess: () => {
            refetchNotifications();
        }
    });

    // Present the data when available
    useEffect(() => {
        if (notificationsResponse) {
            // @ts-ignore
            presenter.present(notificationsResponse, viewModel);
        }
    }, [notificationsResponse, presenter, viewModel]);

    // Handle loading state
    if (!viewModel) {
        return <DefaultLoading locale={locale} />;
    }

    // Handle error state
    if (viewModel.mode === 'kaboom') {
        return <DefaultError locale={locale} />;
    }

    // Handle success state
    if (viewModel.mode === 'default') {
        const notifications = viewModel.data.notifications;

        // Convert notifications to Activity components
        const activityComponents = notifications.map((notification) => (
            <Activity
                key={notification.id}
                message={notification.message}
                action={notification.action || { title: 'View', url: '#' }}
                timestamp={notification.timestamp}
                isRead={notification.isRead}
                platformName="E-Class"
                recipients={1}
                layout="horizontal"
                locale={locale}
                onClickActivity={(url: string) => () => {
                    if (url && url !== '#') {
                        window.open(url, '_blank');
                    }
                }}
            />
        ));

        const handleMarkAllAsRead = () => {
            const unreadNotificationIds = notifications
                .filter(n => !n.isRead)
                .map(n => n.id);
            
            if (unreadNotificationIds.length > 0) {
                markAsReadMutation.mutate({ 
                    notificationIds: unreadNotificationIds 
                });
            }
        };

        const handleViewAll = () => {
            // TODO: Navigate to full notifications page
            alert('Navigate to full notifications page');
        };

        return (
            <div className="w-full">
                <RecentActivity
                    locale={locale}
                    maxActivities={5}
                    variation="Feed"
                    onClickMarkAllAsRead={handleMarkAllAsRead}
                    onClickViewAll={handleViewAll}
                    className="w-full"
                >
                    {activityComponents}
                </RecentActivity>
            </div>
        );
    }

    return null;
}