import React from 'react';
import { useTabContext } from './tabContext';
import { cn } from '../../../utils/style-utils';

interface TabTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  children: React.ReactNode;
  variant?: 'default';
  icon?: React.ReactNode;
}

export function TabTrigger({
  icon,
  value,
  children,
  className,
  variant = 'default',
  ...props
}: TabTriggerProps) {
  const { activeTab, setActiveTab } = useTabContext();
  const isActive = activeTab === value;

  const baseStyles =
    'w-full px-4 py-2 font-bold transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 relative overflow-hidden';
  const variantStyles = {
    default: cn(
      'transform transition-transform hover:scale-105',
      isActive
        ? 'flex items-center justify-center bg-button-primary-fill  rounded-medium   text-button-primary-text'
        : 'border-transparent text-text-primary',
    ),
  };

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${value}`}
      tabIndex={isActive ? 0 : -1}
      onClick={() => setActiveTab(value)}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      <div className="flex items-center justify-center gap-2 w-full">
        {icon && (
          <span
            className={cn(
              isActive
                ? 'text-button-primary-text'
                : 'text-button-primary-fill',
            )}
          >
            {icon}
          </span>
        )}
        <span>{children}</span>
      </div>
    </button>
  );
}
