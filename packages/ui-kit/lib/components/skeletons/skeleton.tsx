import { cn } from '../../utils/style-utils';
import React from 'react';

export function Skeleton({
                           className,
                           ...props
                         }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-base-neutral-800', className)}
      {...props}
    />
  );
}
