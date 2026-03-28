'use client';

import { useEffect, useState } from 'react';
import { DefaultLoading, SideMenu } from '@maany_shr/e-class-ui-kit';
import { useSession } from 'next-auth/react';
import type { TLocale } from '@maany_shr/e-class-translations';
import type { MenuItem } from 'packages/ui-kit/lib/components/sidemenu/sidemenu-item';
import { PlatformWorkspaceSidebarContent } from './platform-workspace-sidebar-content';
import {
  usePlatformWorkspaceSidebarModel,
  type PlatformWorkspaceSidebarUserRole,
} from './use-platform-workspace-sidebar-model';

export interface PlatformWorkspaceSidebarPanelProps {
  locale: TLocale;
  userName: string;
  userRole: PlatformWorkspaceSidebarUserRole;
  profileImageUrl?: string;
  mode?: 'desktop' | 'mobileOverlay';
  defaultCollapsed?: boolean;
  className?: string;
  onClose?: () => void;
}

export const PlatformWorkspaceSidebarPanel = ({
  locale,
  userName,
  userRole,
  profileImageUrl,
  mode = 'desktop',
  defaultCollapsed = false,
  className,
  onClose,
}: PlatformWorkspaceSidebarPanelProps) => {
  const { data: sessionData } = useSession();
  const resolvedProfileImageUrl = sessionData?.user?.image ?? profileImageUrl;
  const [isCollapsed, setIsCollapsed] = useState(
    mode === 'desktop' ? defaultCollapsed : false,
  );
  const { menuGroups, activeItem, isLoggingOut, handleItemClick, rating } =
    usePlatformWorkspaceSidebarModel({
      locale,
      userRole,
      username: userName,
    });

  useEffect(() => {
    if (mode === 'mobileOverlay') {
      setIsCollapsed(false);
    }
  }, [mode]);

  const handleToggle = (currentIsCollapsed: boolean) => {
    setIsCollapsed(!currentIsCollapsed);
  };

  const handleSidebarItemClick = (item: MenuItem) => {
    handleItemClick(item);

    if (mode === 'mobileOverlay' && onClose) {
      onClose();
    }
  };

  return (
    <>
      <SideMenu
        userName={userName}
        userRole={userRole}
        profileImageUrl={resolvedProfileImageUrl}
        rating={rating}
        locale={locale}
        className={className}
        isCollapsed={mode === 'mobileOverlay' ? false : isCollapsed}
        onClickToggle={mode === 'desktop' ? handleToggle : undefined}
        mode={mode}
        onClose={mode === 'mobileOverlay' ? onClose : undefined}
      >
        <PlatformWorkspaceSidebarContent
          menuGroups={menuGroups}
          activeItem={activeItem}
          isCollapsed={mode === 'mobileOverlay' ? false : isCollapsed}
          onItemClick={handleSidebarItemClick}
        />
      </SideMenu>

      {isLoggingOut && <DefaultLoading locale={locale} variant="overlay" />}
    </>
  );
};

export default PlatformWorkspaceSidebarPanel;
