'use client';

import {
    Breadcrumbs,
    Button,
} from '@maany_shr/e-class-ui-kit';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { useCallback } from 'react';
import UserCoursesList from './user-courses-list';
import UserCoachingSessions from './user-coaching-sessions';
import UserNotifications from './user-notifications';

interface UserDashboardProps {
    roles: string[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
export default function UserDashboard({ roles }: UserDashboardProps) {
    const { data: session } = useSession();

    const breadcrumbsTranslations = useTranslations('components.breadcrumbs');

    const handleEditProfile = useCallback(() => {
        // TODO: Implement proper navigation or modal for editing profile
    }, []);

    const handleViewCalendar = useCallback(() => {
        // TODO: Implement proper navigation to calendar view
    }, []);

    const getDisplayName = useCallback(() => {
        if (session?.user?.name) {
            return session.user.name;
        }
        return 'Student';
    }, [session?.user?.name]);

    return (
        <div className="min-h-screen text-white">
            <div className="flex flex-col space-y-2 p-6">
                <Breadcrumbs
                    items={[
                        {
                            label: breadcrumbsTranslations('home'),
                            onClick: () => {
                                // TODO: Implement navigation to home
                            },
                        },
                        {
                            label: breadcrumbsTranslations('workspace'),
                            onClick: () => {
                                // TODO: Implement navigation to workspace
                            },
                        },
                        {
                            label: breadcrumbsTranslations('dashboard'),
                            onClick: () => {
                                // Nothing should happen on clicking the current page
                            },
                        },
                    ]}
                />
                <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-white text-2xl font-semibold">
                             {getDisplayName()}
                        </h1>
                        <div className="flex space-x-2">
                            <Button
                                variant="secondary"
                                size="small"
                                onClick={handleEditProfile}
                            >
                                Edit Profile
                            </Button>
                            <Button
                                variant="primary"
                                size="small"
                                onClick={handleViewCalendar}
                            >
                                View Calendar
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 gap-6">
                    <div className="xl:col-span-3 lg:col-span-2 space-y-6">
                        <UserCoursesList />
                        <UserCoachingSessions />
                    </div>
                    <div className="xl:col-span-1 lg:col-span-1">
                        <UserNotifications />
                    </div>
                </div>
            </div>
        </div>
    );
}