'use client';
import type { ComponentProps } from 'react';
import { PlatformWorkspaceSidebarPanel } from '../../../client/pages/layouts/platform-workspace-sidebar-panel';

const WorkspaceSidebar = (
    props: Omit<ComponentProps<typeof PlatformWorkspaceSidebarPanel>, 'mode'>,
) => {
    return <PlatformWorkspaceSidebarPanel {...props} mode="desktop" />;
};

export default WorkspaceSidebar;
