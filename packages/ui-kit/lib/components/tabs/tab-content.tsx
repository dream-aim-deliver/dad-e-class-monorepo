
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
      hidden={!isActive}
      className={cn(
        'mt-4 focus:outline-none transition-all duration-300',
        isActive ? 'tab-content-enter' : 'tab-content-exit text-button-primary-fill',
        className
      )}
      tabIndex={0}
      {...props}
    >
      <div className="transform transition-all duration-300 ease-out">
        {isActive && children}
      </div>
    </div>
  );
}