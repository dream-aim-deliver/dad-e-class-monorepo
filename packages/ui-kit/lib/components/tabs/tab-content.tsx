import React from 'react';
import { useTabContext } from './tab-context';
import { cn } from '../../utils/style-utils';


interface TabContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

export function TabContent({
  value,
  children,
  className,
  ...props
}: TabContentProps) {
  const { activeTab } = useTabContext();
  const isActive = activeTab === value;

  return (
    <div
      role="tabpanel"
      id={`panel-${value}`}
      aria-labelledby={`tab-${value}`}
      className={cn(
        'h-full',
        !isActive && 'hidden', // hides but does not unmount
        className
      )}
      tabIndex={0}
      {...props}
    >
      {children} {/* Always render, just hidden when inactive */}
    </div>
  );
}
