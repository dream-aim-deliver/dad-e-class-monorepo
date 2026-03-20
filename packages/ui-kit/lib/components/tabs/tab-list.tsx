'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '../../utils/style-utils';

interface TabListProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    variant?: 'default' | 'small';
    fullWidth?: boolean;
}

const SCROLL_TOLERANCE = 1;
const FADE_WIDTH_CLASS = 'w-20';

function toTransparentColor(color: string) {
    const match = color.match(/rgba?\(([^)]+)\)/);

    if (!match) {
        return 'rgba(28, 25, 23, 0)';
    }

    const [red = '28', green = '25', blue = '23'] = match[1]
        .split(',')
        .slice(0, 3)
        .map((value) => value.trim());

    return `rgba(${red}, ${green}, ${blue}, 0)`;
}

export function TabList({
    children,
    className,
    variant = 'default',
    fullWidth = false,
    ...props
}: TabListProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeftFade, setShowLeftFade] = useState(false);
    const [showRightFade, setShowRightFade] = useState(false);
    const [fadeColor, setFadeColor] = useState('rgb(28, 25, 23)');

    const variantStyles = {
        default:
            'flex overflow-x-auto w-full bg-card-fill rounded-medium p-2 gap-2 border-[1px] border-card-stroke ' +
            'lg:p-2 sm:gap-2',
        small:
            'flex overflow-x-auto w-full bg-card-fill rounded-medium p-2 gap-1 border-[1px] border-card-stroke ' +
            'lg:p-1 sm:gap-2',
    };

    const updateFadeState = useCallback(() => {
        const node = scrollRef.current;

        if (!node) {
            return;
        }

        const { scrollLeft, clientWidth, scrollWidth } = node;
        const computedBackgroundColor = window.getComputedStyle(node).backgroundColor;

        setShowLeftFade(scrollLeft > SCROLL_TOLERANCE);
        setShowRightFade(
            scrollLeft + clientWidth < scrollWidth - SCROLL_TOLERANCE,
        );

        if (
            computedBackgroundColor &&
            computedBackgroundColor !== 'transparent' &&
            computedBackgroundColor !== 'rgba(0, 0, 0, 0)'
        ) {
            setFadeColor((currentColor) =>
                currentColor === computedBackgroundColor
                    ? currentColor
                    : computedBackgroundColor,
            );
        }
    }, []);

    useEffect(() => {
        const node = scrollRef.current;

        if (!node) {
            return;
        }

        updateFadeState();

        const resizeObserver =
            typeof ResizeObserver !== 'undefined'
                ? new ResizeObserver(() => updateFadeState())
                : null;

        const requestId = window.requestAnimationFrame(updateFadeState);

        node.addEventListener('scroll', updateFadeState, { passive: true });
        window.addEventListener('resize', updateFadeState);
        resizeObserver?.observe(node);

        return () => {
            window.cancelAnimationFrame(requestId);
            node.removeEventListener('scroll', updateFadeState);
            window.removeEventListener('resize', updateFadeState);
            resizeObserver?.disconnect();
        };
    }, [children, updateFadeState]);

    const transparentFadeColor = useMemo(
        () => toTransparentColor(fadeColor),
        [fadeColor],
    );

    const leftFadeStyle = {
        backgroundImage: `linear-gradient(to right, ${fadeColor} 0%, ${transparentFadeColor} 100%)`,
    };
    const rightFadeStyle = {
        backgroundImage: `linear-gradient(to left, ${fadeColor} 0%, ${transparentFadeColor} 100%)`,
    };

    return (
        <div
            className={cn('relative max-w-full', fullWidth && 'w-full')}
        >
            <div
                ref={scrollRef}
                role="tablist"
                className={cn(
                    'flex gap-2 items-stretch',
                    variantStyles[variant],
                    className,
                )}
                {...props}
            >
                {children}
            </div>
            {showLeftFade && (
                <div
                    aria-hidden="true"
                    className={cn(
                        'pointer-events-none absolute left-0 top-0 z-10 h-full rounded-l-medium',
                        FADE_WIDTH_CLASS,
                    )}
                    style={leftFadeStyle}
                />
            )}
            {showRightFade && (
                <div
                    aria-hidden="true"
                    className={cn(
                        'pointer-events-none absolute right-0 top-0 z-10 h-full rounded-r-medium',
                        FADE_WIDTH_CLASS,
                    )}
                    style={rightFadeStyle}
                />
            )}
        </div>
    );
}
