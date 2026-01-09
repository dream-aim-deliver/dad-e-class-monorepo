'use client';

import { trpc } from '../trpc/cms-client';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { DefaultLoading, DefaultError, UserGrid, Breadcrumbs, SendNotificationModal, type UserRow } from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { viewModels } from '@maany_shr/e-class-models';
import { useListUsersPresenter } from '../hooks/use-list-users-presenter';
import { useRequiredPlatformLocale } from '../context/platform-locale-context';
import { useRequiredPlatform } from '../context/platform-context';
import { useRouter } from 'next/navigation';
import { TUserListItem } from '@dream-aim-deliver/e-class-cms-rest';


interface PlatformUsersProps {
  locale: TLocale;
  platformSlug: string;
}

export default function PlatformUsers({ locale, platformSlug }: PlatformUsersProps) {
  const currentLocale = useLocale() as TLocale;
  const t = useTranslations('pages.cmsPlatformUsers');
  const breadcrumbsTranslations = useTranslations('components.breadcrumbs');

  // Platform context
  const platformContext = useRequiredPlatformLocale();
  const { platform } = useRequiredPlatform();
  const router = useRouter();

  // Grid ref for AG Grid instance
  const gridRef = useRef<any>(null);

  // Modal state
  const [isSendNotificationModalOpen, setIsSendNotificationModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<UserRow[]>([]);

  // ViewModel state
  const [listUsersViewModel, setListUsersViewModel] = useState<
    viewModels.TListUsersViewModel | undefined
  >(undefined);

  // Presenter hook
  const { presenter } = useListUsersPresenter(setListUsersViewModel);

  // TRPC query for page data
  const [usersResponse] = trpc.listUsers.useSuspenseQuery({});

  // TRPC mutation for sending notifications (must be before early returns)
  const utils = trpc.useUtils();
  const sendNotificationMutation = trpc.sendNotification.useMutation({
    onSuccess: () => {
      utils.listUsers.invalidate();
    },
  });

  // Call presenter in useEffect to avoid "Update hook called on initial render" error
  useEffect(() => {
    // @ts-ignore
    presenter.present(usersResponse, listUsersViewModel);
  }, [usersResponse, listUsersViewModel, presenter]);

  // Compute transformed users (only used if viewModel is default mode, but compute it here to avoid hook ordering issues)
  // Memoize to prevent AG Grid from resetting selection on re-renders
  const transformedUsers: UserRow[] = useMemo(() => {
    if (!listUsersViewModel || listUsersViewModel.mode !== 'default') {
      return [];
    }
    return listUsersViewModel.data.users.map((user: TUserListItem) => ({
      userId: user.id,
      id: user.id,
      name: user.name ?? '',
      surname: user.surname ?? '',
      email: user.email,
      phone: user.phone ?? '',
      phoneNumber: user.phone ?? undefined,
      rating: 'rating' in user ? (user.rating ?? undefined) : undefined,
      roles: user.roles,
      coachingSessionsCount: user.coachingSessionsCount ?? undefined,
      coursesBought: user.coursesBought ?? undefined,
      coursesCreated: user.coursesCreated ?? undefined,
      lastAccess: user.lastAccess,
      username: user.username,
      interfaceLanguage: { code: 'en', name: 'English' }, // Default values since not provided by backend
      receiveNewsletter: false,
    }));
  }, [listUsersViewModel]);

  // Handlers (must be before early returns)
  const handleUserDetailsClick = (user: UserRow) => {
    if (user.username) {
      router.push(`/${locale}/platform/${platformSlug}/${platformContext.platformLocale}/users/${user.username}`);
    }
  };

  const handleEmailClick = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      // Optional: You could add a toast notification here to confirm the copy
    } catch (error) {
      console.error('Failed to copy email to clipboard:', error);
    }
  };

  // Get selected users from grid
  const getSelectedUsersFromGrid = useCallback((): UserRow[] => {
    if (!gridRef.current?.api) return [];
    const selectedRows = gridRef.current.api.getSelectedRows() as UserRow[];
    return selectedRows;
  }, []);

  const handleSendNotifications = useCallback((userIds: number[]) => {
    const selected = transformedUsers.filter(user => userIds.includes(user.userId));
    setSelectedUsers(selected);
    setIsSendNotificationModalOpen(true);
  }, [transformedUsers]);

  // Handle sending notification from modal
  const handleSendNotificationFromModal = useCallback(async (data: {
    userIds: number[];
    notification: {
      message: string;
      actionTitle: string;
      actionUrl: string;
      sendEmail: boolean;
    };
  }) => {
    await sendNotificationMutation.mutateAsync(data);
  }, [sendNotificationMutation]);

  // Loading state
  if (!listUsersViewModel) {
    return <DefaultLoading locale={currentLocale} variant="minimal" />;
  }

  // Error handling
  if (listUsersViewModel.mode === 'kaboom') {
    const errorData = listUsersViewModel.data;
    console.error(errorData);
    return (
      <DefaultError
        locale={currentLocale}
        title={t('error.title')}
        description={t('error.description')}
      />
    );
  }

  if (listUsersViewModel.mode === 'not-found') {
    const errorData = listUsersViewModel.data;
    console.error(errorData);
    return (
      <DefaultError
        locale={currentLocale}
        title={t('error.notFound.title')}
        description={t('error.notFound.description')}
      />
    );
  }

  // Breadcrumbs following the standard pattern
  const breadcrumbItems = [
    {
      label: breadcrumbsTranslations('platforms'),
      onClick: () => router.push('/'),
    },
    {
      label: platform.name,
      onClick: () => router.push(`/platform/${platformSlug}/${platformContext.platformLocale}`),
    },
    {
      label: 'Users',
      onClick: () => {
        // Nothing should happen on clicking the current page
      },
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] space-y-2 gap-4">
      <div className="flex-shrink-0">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <div className="flex-shrink-0 flex flex-col space-y-2">
        <h1>{t('title')}</h1>
        <p className="text-text-secondary text-sm">
          Platform: {platformContext.platformSlug} | Content Language: {platformContext.platformLocale.toUpperCase()}
        </p>
      </div>

      {/* Users Grid */}
      <div className="flex-1 min-h-0 bg-transparent">
        <UserGrid
          gridRef={gridRef}
          users={transformedUsers}
          locale={currentLocale}
          onUserDetailsClick={handleUserDetailsClick}
          onEmailClick={handleEmailClick}
          emailTooltip={t('copyEmailTooltip')}
          enableSelection={true}
          onSendNotifications={handleSendNotifications}
          showDetailsColumn={true}
        />
      </div>

      {/* Send Notification Modal */}
      <SendNotificationModal
        isOpen={isSendNotificationModalOpen}
        onClose={() => {
          setIsSendNotificationModalOpen(false);
          setSelectedUsers([]);
          // Reset mutation state to allow modal to work properly on next open
          sendNotificationMutation.reset();
          // Clear selection in grid
          if (gridRef.current?.api) {
            gridRef.current.api.deselectAll();
          }
        }}
        recipients={selectedUsers}
        onSendNotification={handleSendNotificationFromModal}
        isSending={sendNotificationMutation.isPending}
        isSuccess={sendNotificationMutation.isSuccess}
        recipientCount={sendNotificationMutation.data && 'data' in sendNotificationMutation.data ? (sendNotificationMutation.data as any).data?.notification?.receivers?.length : undefined}
        locale={currentLocale}
      />
    </div>
  );
}
