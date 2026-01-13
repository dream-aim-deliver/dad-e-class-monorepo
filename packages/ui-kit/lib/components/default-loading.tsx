'use client';
import { TLocale, getDictionary } from "@maany_shr/e-class-translations";
import { IconLoaderSpinner } from "./icons/icon-loader-spinner";
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

interface DefaultLoadingProps {
    locale: TLocale;
    variant?: 'minimal' | 'card' | 'overlay';
    /** Optional logo element to display above the loading spinner (minimal variant only) */
    logo?: React.ReactNode;
}

/**
 * A versatile loading component with three distinct variants for different use cases.
 * 
 * @param locale - The current locale for internationalized loading text
 * @param variant - The visual style variant to render
 * 
 * **Variants:**
 * - `minimal`: Fullscreen centered spinner with secondary text colors
 * - `card`: Self-contained card with border, background, and primary colors
 * - `overlay`: Fullscreen portal overlay with backdrop blur for blocking interactions
 * 
 * @example
 * ```tsx
 * // Basic inline loading
 * <DefaultLoading locale="en" variant="minimal" />
 * 
 * // Card variant for content areas
 * <DefaultLoading locale="de" variant="card" />
 * 
 * // Overlay for blocking interactions (logout, form submission)
 * <DefaultLoading locale="en" variant="overlay" />
 * ```
 * 
 * @example
 * ```tsx
 * // In a component with conditional rendering
 * function MyComponent() {
 *   const [isLoading, setIsLoading] = useState(false);
 *   
 *   if (isLoading) {
 *     return <DefaultLoading locale="en" variant="card" />;
 *   }
 *   
 *   return <div>Content loaded!</div>;
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // Overlay for logout functionality
 * {isLoggingOut && (
 *   <DefaultLoading locale={locale} variant="overlay" />
 * )}
 * ```
 */
export default function DefaultLoading({
    locale,
    variant = 'minimal',
    logo
}: DefaultLoadingProps) {
    const dictionary = getDictionary(locale).components.defaultLoading;
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (variant === 'overlay') {
        if (!mounted) return null;
        
        const overlayContent = (
            <div className="fixed top-0 left-0 w-full h-full backdrop-blur-sm bg-transparent flex items-center justify-center z-[9999]">
                <div className="flex items-center gap-3 bg-black/90 px-6 py-4 rounded-lg shadow-lg">
                    <IconLoaderSpinner 
                        size="8"
                        classNames="text-white animate-spin"
                    />
                    <p className="text-text-primary text-sm">
                        {dictionary.loading}
                    </p>
                </div>
            </div>
        );

        return createPortal(overlayContent, document.body);
    }

    if (variant === 'card') {
        return (
            <div className="flex flex-col items-center justify-center bg-card-fill border border-card-stroke rounded-lg shadow-sm p-6">
                <div className="flex flex-col items-center text-center">
                    <IconLoaderSpinner 
                        size="8"
                        classNames="text-button-primary-fill animate-spin"
                    />
                    <p className="text-text-primary font-important mt-3 text-sm">
                        {dictionary.loading}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full backdrop-blur-sm bg-black/10 flex flex-col items-center justify-center z-50 gap-4">
            {logo && <div className="mb-2">{logo}</div>}
            <div className="flex items-center space-x-3">
                <IconLoaderSpinner
                    size="8"
                    classNames="text-text-secondary animate-spin"
                />
                <p className="text-text-secondary font-normal text-sm">
                    {dictionary.loading}
                </p>
            </div>
        </div>
    );
};