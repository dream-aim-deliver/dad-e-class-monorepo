'use client';

import { SideMenuItem } from '@maany_shr/e-class-ui-kit';
import type { MenuItem } from 'packages/ui-kit/lib/components/sidemenu/sidemenu-item';

interface PlatformWorkspaceSidebarContentProps {
  menuGroups: MenuItem[][];
  activeItem: string;
  isCollapsed?: boolean;
  onItemClick: (item: MenuItem) => void;
}

export const PlatformWorkspaceSidebarContent = ({
  menuGroups,
  activeItem,
  isCollapsed = false,
  onItemClick,
}: PlatformWorkspaceSidebarContentProps) => {
  return (
    <>
      {menuGroups.map((group, index) => (
        <div key={index} className="flex flex-col w-full">
          {index > 0 && <div className="h-[1px] bg-divider my-2" />}
          {group.map((item) => (
            <SideMenuItem
              key={item.label}
              item={{
                ...item,
                isActive: item.label === activeItem,
              }}
              onClickItem={onItemClick}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      ))}
    </>
  );
};

export default PlatformWorkspaceSidebarContent;
