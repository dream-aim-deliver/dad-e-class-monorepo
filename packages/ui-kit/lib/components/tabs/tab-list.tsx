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
        default:
            // Responsive: smaller padding/gap on mobile, larger on md+
            'flex overflow-x-auto w-full bg-card-fill rounded-medium p-1 gap-1 border-[1px] border-card-stroke ' +
            'lg:p-2 sm:gap-2',
        small:
            'flex overflow-x-auto w-full bg-card-fill rounded-medium p-0.5 gap-1 border-[1px] border-card-stroke ' +
            'lg:p-1 sm:gap-2',
    };

    return (
        <div
            role="tablist"
            className={cn(
                'flex gap-2 items-center',
                variantStyles[variant],
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}
