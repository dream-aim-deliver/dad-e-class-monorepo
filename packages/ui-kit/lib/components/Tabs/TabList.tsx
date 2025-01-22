import React from 'react';
import { cn } from '../../utils/style-utils';


interface TabListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'small';
  fullWidth?: boolean;
}

export function TabList({ 
  children, 
  className,
  variant = 'default',
  fullWidth = false,
  ...props 
}: TabListProps) {
 
  const variantStyles = {
    default: "flex overflow-x-auto w-full bg-card-stroke rounded-medium p-2 gap-2",
    small:"flex overflow-x-autob w-full bg-card-stroke rounded-medium p-1 gap-2",
  };
  
  return (
    <div
      role="tablist"
      className={cn(
        "flex  gap-2 items-center",
        variantStyles[variant],
        className,
       
      )}
      {...props}
    >
      {children}
    </div>
  );
}