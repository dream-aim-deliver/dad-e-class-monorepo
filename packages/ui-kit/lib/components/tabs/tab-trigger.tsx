import React from 'react';
import { useTabContext } from './tab-context';
import { cn } from '../../utils/style-utils';

interface TabTriggerProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
    children: React.ReactNode;
    variant?: 'default';
    icon?: React.ReactNode;
    isLast: boolean;
}

export function TabTrigger({

  icon,
  value,
  children,
  className,
  disabled,
  isLast = false,
  variant = 'default',
  ...props
}: TabTriggerProps) {
    const { activeTab, setActiveTab } = useTabContext();
    const isActive = activeTab === value;

    const baseStyles =
        'relative flex w-fit self-stretch items-stretch overflow-hidden px-4 py-2 font-important transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-offset-2';
    const variantStyles = {
        default: cn(
            'cursor-pointer transform transition-transform hover:scale-95',
            isActive
                ? 'bg-button-primary-fill rounded-medium text-button-primary-text'
                : 'border-transparent text-text-primary',
            disabled && 'opacity-50 cursor-not-allowed',
        ),
    };

    return (
        <div className={cn(
            "flex w-full self-stretch items-stretch justify-center pr-1",
            isLast ? "" : "border-r-1 border-divider" // Las tab without divider
        )}>
            <button
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${value}`}
                tabIndex={isActive ? 0 : -1}
                disabled={disabled}
                onClick={() => setActiveTab(value)}
                className={cn(baseStyles, variantStyles[variant], 'w-full', className)}
                {...props}
            >
                {/* min-h-[3.5rem] */}
                <div className="flex h-full w-full items-center justify-center gap-2 text-center transform transition-transform hover:scale-95">
                    {icon && (
                        <span
                            className={cn(
                                isActive ? 'text-black' : 'text-base-brand-500',
                            )}
                        >
                            {icon}
                        </span>
                    )}
                    <span className="leading-[120%]">{children}</span>
                </div>
            </button>
        </div>
    );
}
