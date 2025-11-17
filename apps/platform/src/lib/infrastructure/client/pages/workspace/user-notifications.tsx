'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useListNotificationsPresenter } from '../../hooks/use-list-notifications-presenter';
import { useSession } from 'next-auth/react';
import {
    DefaultLoading,
    DefaultError,
} from '@maany_shr/e-class-ui-kit';
import { Activity } from '@maany_shr/e-class-ui-kit';
import { RecentActivity } from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { trpc } from '../../trpc/cms-client';
import { useRequiredPlatform } from '../../context/platform-context';

export default function UserNotifications() {
    const locale = useLocale() as TLocale;
    const sessionDTO = useSession();
    const session = sessionDTO.data;

    const { platform } = useRequiredPlatform();

    const [viewModel, setViewModel] = useState<viewModels.TListNotificationsViewModel | null>(null);
    const { presenter } = useListNotificationsPresenter(setViewModel);


    // Get a valid user ID - memoized for performance
    const getUserId = useCallback((): number => {
        if (!session?.user?.id) return 1;
        const parsed = parseInt(String(session.user.id), 10);
        return isNaN(parsed) ? 1 : parsed;
    }, [session?.user?.id]);

    // Handle view all callback at top level
    const handleViewAll = useCallback(() => {
        window.open(`/workspace/notifications`, '_blank');
    }, []);

    // TRPC queries
    const [notificationsResponse] = trpc.listNotifications.useSuspenseQuery({
        pagination: {
            page: 1,
            pageSize: 5
        }
    });

    const utils = trpc.useUtils();

    // Memoize activity components at top level
    const activityComponents = useMemo(() => {
        if (!viewModel || viewModel.mode !== 'default') return [];

        const notifications = viewModel.data.notifications;
        return notifications.map((notification) => (
            <Activity
                key={notification.id}
                message={notification.message}
                action={{ title: notification.actionTitle, url: notification.actionUrl }}
                timestamp={notification.createdAt instanceof Date ? notification.createdAt.toISOString() : String(notification.createdAt)}
                isRead={notification.isRead}
                platformName={platform.name}
                recipients={1}
                layout="vertical"
                locale={locale}
                onClickActivity={(url: string) => () => {
                    window.open(url, '_blank', 'noopener,noreferrer');
                }
                }
            />
        ));
    }, [viewModel, locale, platform.name]);

    const markAsReadMutation = trpc.markNotificationsAsRead.useMutation({
        onSuccess: () => {
            // Invalidate notifications to refetch updated read status
            utils.listNotifications.invalidate();
        }
    });

    // Present the data when available
    useEffect(() => {
        if (notificationsResponse && presenter) {
            // @ts-ignore
            presenter.present(notificationsResponse, viewModel ?? undefined);
        }
    }, [notificationsResponse, presenter]);

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

        const handleMarkAllAsRead = () => {
            const unreadNotificationIds: number[] = notifications
                .filter(n => !n.isRead)
                .map(n => Number(n.id))
                .filter((id): id is number => !Number.isNaN(id));

            if (unreadNotificationIds.length > 0) {
                markAsReadMutation.mutate({
                    notificationIds: unreadNotificationIds
                });
            }
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