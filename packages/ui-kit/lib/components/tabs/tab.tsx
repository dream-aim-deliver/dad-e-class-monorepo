import React from 'react';

import { TabList } from './tab-list';
import { TabTrigger } from './tab-trigger';
import { TabContent } from './tab-content';
import { cn } from '../../utils/style-utils';
import { TabProvider } from './tab-context';

/**
 * A flexible and reusable Tabs component that allows users to switch between different content sections.
 *
 * @param defaultTab The default selected tab when the component is first rendered.
 * @param children The content inside the tabs, typically including `TabList`, `TabTrigger`, and `TabContent`.
 * @param onValueChange Callback function triggered when a tab selection changes.
 * @param className Additional custom class names for styling.
 * @returns A tab system with customizable structure and behavior, using context for state management.
 *
 * The `Tabs` component provides the following subcomponents:
 * - `Tabs.List` - A container for tab triggers.
 * - `Tabs.Trigger` - A clickable element that switches to a corresponding tab.
 * - `Tabs.Content` - The content section corresponding to a selected tab.
 * - `Tabs.Root` - The root wrapper that manages tab state.
 */


interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultTab: string;
  children: React.ReactNode;
  onValueChange?: (value: string) => void;
}

function TabsRoot({ defaultTab, children, className, ...props }: TabsProps) {
  return (
    <TabProvider defaultTab={defaultTab}>
      <div className={cn('w-full', className)} {...props}>
        {children}
      </div>
    </TabProvider>
  );
}

export const Tabs = {
  Root: TabsRoot,
  List: TabList,
  Trigger: TabTrigger,
  Content: TabContent,
};

export { TabContent, TabTrigger, TabList, TabsRoot };
