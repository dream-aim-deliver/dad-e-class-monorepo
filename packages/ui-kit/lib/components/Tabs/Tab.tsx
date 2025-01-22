import React from 'react';

import { TabList } from './TabList';
import { TabTrigger } from './TabTrigger';
import { TabContent } from './TabContent';
import { cn } from '../../utils/style-utils';
import { TabProvider } from './TabContext';


interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultTab: string;
  children: React.ReactNode;
  onValueChange: (value: string) => void;
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
