'use client';

import { createElement, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import type { TLocale } from '@maany_shr/e-class-translations';
import type { TRole } from 'packages/models/src/role';
import type { MenuItem } from 'packages/ui-kit/lib/components/sidemenu/sidemenu-item';
import {
  IconAccountInformation,
  IconCalendarAlt,
  IconCoachingSession,
  IconCourse,
  IconDashboard,
  IconGroup,
  IconLogOut,
  IconSales,
  IconSendEmail,
  IconStar,
} from '@maany_shr/e-class-ui-kit';

export type PlatformWorkspaceSidebarUserRole =
  | Exclude<TRole, 'visitor'>
  | 'courseCreator';

interface UsePlatformWorkspaceSidebarModelProps {
  locale: TLocale;
  userRole: PlatformWorkspaceSidebarUserRole;
}

export interface PlatformWorkspaceSidebarModel {
  menuGroups: MenuItem[][];
  activeItem: string;
  isLoggingOut: boolean;
  handleItemClick: (item: MenuItem) => void;
}

export const usePlatformWorkspaceSidebarModel = ({
  locale,
  userRole,
}: UsePlatformWorkspaceSidebarModelProps): PlatformWorkspaceSidebarModel => {
  const sidebarTranslations = useTranslations('pages.sidebarLayout');
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [activeItem, setActiveItem] = useState('');

  const routeMap = useMemo(
    () => ({
      dashboard: `/${locale}/workspace/dashboard`,
      courses: `/${locale}/workspace/courses`,
      coachingSessions: `/${locale}/workspace/coaching-sessions`,
      calendar: `/${locale}/workspace/calendar`,
      students: `/${locale}/workspace/students`,
      reviews: `/${locale}/workspace/your-reviews`,
      notifications: `/${locale}/workspace/notifications`,
      profile: `/${locale}/workspace/profile`,
      orderPayments: `/${locale}/workspace/billing`,
    }),
    [locale],
  );

  const handleLogout = useCallback(async () => {
    try {
      setIsLoggingOut(true);
      await signOut({ callbackUrl: `/${locale}/` });
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  }, [locale]);

  const routeToLabelMap = useMemo(() => {
    const isStudent = userRole === 'student';
    const baseRoutes = {
      '/workspace/dashboard': sidebarTranslations('dashboard'),
      '/workspace': sidebarTranslations('dashboard'),
      '/workspace/courses': isStudent
        ? sidebarTranslations('courses')
        : sidebarTranslations('yourCourses'),
      '/workspace/coaching-sessions': isStudent
        ? sidebarTranslations('coachingSessions')
        : sidebarTranslations('yourCoachingSessions'),
      '/workspace/calendar': sidebarTranslations('calendar'),
      '/workspace/students': sidebarTranslations('yourStudents'),
      '/workspace/your-reviews': sidebarTranslations('yourReviews'),
      '/workspace/notifications': sidebarTranslations('notifications'),
      '/workspace/profile': sidebarTranslations('yourProfile'),
      '/workspace/billing': sidebarTranslations('orderPayments'),
      '/workspace/pre-course-assessment': 'Pre-Course Assessment',
    };

    const mapping: Record<string, string> = {};

    Object.entries(baseRoutes).forEach(([path, label]) => {
      mapping[path] = label;
      mapping[`/${locale}${path}`] = label;
    });

    return mapping;
  }, [locale, sidebarTranslations, userRole]);

  const menuGroups = useMemo<MenuItem[][]>(() => {
    const isStudent = userRole === 'student';

    return [
      [
        {
          icon: createElement(IconDashboard),
          label: sidebarTranslations('dashboard'),
          onClick: () => router.push(routeMap.dashboard),
        },
        {
          icon: createElement(IconCourse),
          label: isStudent
            ? sidebarTranslations('courses')
            : sidebarTranslations('yourCourses'),
          onClick: () => router.push(routeMap.courses),
        },
        {
          icon: createElement(IconCoachingSession),
          label: isStudent
            ? sidebarTranslations('coachingSessions')
            : sidebarTranslations('yourCoachingSessions'),
          onClick: () => router.push(routeMap.coachingSessions),
        },
        {
          icon: createElement(IconCalendarAlt),
          label: sidebarTranslations('calendar'),
          onClick: () => router.push(routeMap.calendar),
        },
        {
          icon: createElement(IconSendEmail),
          label: sidebarTranslations('notifications'),
          onClick: () => router.push(routeMap.notifications),
        },
        ...(!isStudent
          ? [
              {
                icon: createElement(IconGroup),
                label: sidebarTranslations('yourStudents'),
                onClick: () => router.push(routeMap.students),
              },
              {
                icon: createElement(IconStar),
                label: sidebarTranslations('yourReviews'),
                onClick: () => router.push(routeMap.reviews),
              },
            ]
          : []),
      ],
      [
        {
          icon: createElement(IconAccountInformation),
          label: sidebarTranslations('yourProfile'),
          onClick: () => router.push(routeMap.profile),
        },
        {
          icon: createElement(IconSales),
          label: sidebarTranslations('orderPayments'),
          onClick: () => router.push(routeMap.orderPayments),
        },
      ],
      [
        {
          icon: createElement(IconLogOut),
          label: sidebarTranslations('logout'),
          onClick: handleLogout,
        },
      ],
    ];
  }, [handleLogout, routeMap, router, sidebarTranslations, userRole]);

  useEffect(() => {
    let currentLabel = routeToLabelMap[pathname];

    if (!currentLabel) {
      const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '');
      currentLabel = routeToLabelMap[pathWithoutLocale];
    }

    setActiveItem(currentLabel ?? '');
  }, [pathname, routeToLabelMap]);

  const handleItemClick = useCallback((item: MenuItem) => {
    setActiveItem(item.label);
    item.onClick();
  }, []);

  return {
    menuGroups,
    activeItem,
    isLoggingOut,
    handleItemClick,
  };
};
