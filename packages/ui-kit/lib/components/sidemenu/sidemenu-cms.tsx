'use client';
import { FC } from 'react';
import { IconButton } from '../icon-button';
import { IconChevronRight } from '../icons/icon-chevron-right';
import { IconChevronLeft } from '../icons/icon-chevron-left';
import { Dropdown } from '../dropdown';
import { TLocale } from '@maany_shr/e-class-translations';
import { cn } from '../../utils/style-utils';
import { useImageComponent } from '../../contexts/image-component-context';

export interface SideMenuCMSProps {
    platformName: string;
    platformLogoUrl?: string;
    children: React.ReactNode;
    className?: string;
    isCollapsed?: boolean;
    onClickToggle?: (isCollapsed: boolean) => void;
    locale?: TLocale;
    availableLocales?: TLocale[];
    onChangeLanguage?: (locale: TLocale) => void;
}

/**
 * A collapsible SideMenu component for CMS that displays platform branding and navigation items.
 * The menu supports an initial collapsed state and dynamically adjusts its layout accordingly.
 *
 * @param platformName The name of the platform to display at the top.
 * @param platformLogoUrl URL of the platform logo image.
 * @param children Menu items and sections to render inside the menu.
 * @param className Optional CSS class for styling the SideMenu container.
 * @param isCollapsed Optional initial collapsed state of the SideMenu. Defaults to false.
 * @param onClickToggle Optional callback function to handle toggle button click events.
 * @param locale The locale for translations.
 *
 * @example
 * <SideMenuCMS
 *   platformName="Just Do Ad"
 *   platformLogoUrl="https://example.com/logo.png"
 *   locale="en"
 *   children={<div>Menu items here</div>}
 *   isCollapsed={false}
 *   onClickToggle={(collapsed) => console.log('Collapsed:', collapsed)}
 * />
 */

export const SideMenuCMS: FC<SideMenuCMSProps> = ({
    platformName,
    platformLogoUrl,
    className,
    isCollapsed = false,
    children,
    onClickToggle,
    locale,
    availableLocales = [],
    onChangeLanguage,
}) => {
    const ImageComponent = useImageComponent();
    const languageOptions = availableLocales.map((loc) => ({
        label: loc.toUpperCase(),
        value: loc,
    }));

    const handleLocaleChange = (selected: string | string[]) => {
        if (
            typeof selected === 'string' &&
            availableLocales.includes(selected as TLocale) &&
            onChangeLanguage
        ) {
            onChangeLanguage(selected as TLocale);
        }
    };
    return (
        <div
            className={cn(
                'bg-card-fill rounded-medium border-[1px] border-card-stroke flex flex-col gap-4 py-6 items-center relative overflow-hidden transition-all duration-500 ease-in-out',
                isCollapsed ? 'w-[4rem] px-4 gap-3' : `w-[20rem] px-5`,
                className,
            )}
            data-testid="cms-menu-container"
        >
            {/* Platform Branding Section */}
            <div className="flex flex-row justify-between items-start w-full">
                <div className={cn('flex flex-col gap-4 h-auto items-start')}>
                    {platformLogoUrl && (
                        <div className={cn('flex items-center flex-shrink-0')}>
                            <ImageComponent
                                src={platformLogoUrl}
                                alt={`${platformName} logo`}
                                width={isCollapsed ? 32 : 48}
                                height={isCollapsed ? 32 : 48}
                                className={cn(
                                    'object-contain',
                                    isCollapsed ? 'w-8 h-8' : 'w-12 h-12',
                                )}
                            />
                        </div>
                    )}
                    {!isCollapsed && (
                        <div className="flex flex-col items-start justify-center min-w-0">
                            <p className="text-text-primary text-md font-bold leading-[150%] truncate">
                                {platformName}
                            </p>
                        </div>
                    )}
                </div>
                {/* Language Selector */}
                {!isCollapsed && locale && availableLocales.length > 1 && (
                    <div className="flex items-start flex-shrink-0">
                        <Dropdown
                            type="simple"
                            options={languageOptions}
                            onSelectionChange={(selected) => {
                                if (
                                    typeof selected === 'string' &&
                                    availableLocales.includes(
                                        selected as TLocale,
                                    )
                                ) {
                                    handleLocaleChange(selected as TLocale);
                                }
                            }}
                            text={{ simpleText: '' }}
                            defaultValue={locale}
                        />
                    </div>
                )}
            </div>

            {/* Menu Items */}
            <div className="flex flex-col items-end self-stretch overflow-y-auto flex-1">
                {children}
            </div>

            {/* Collapse Button */}
            <div
                className={cn(
                    'flex w-[2rem] h-[2rem] absolute p-[4] right-[0.5rem] bottom-[0.5rem] items-center',
                )}
                data-testid="toggle-container"
            >
                <IconButton
                    icon={
                        isCollapsed ? <IconChevronRight /> : <IconChevronLeft />
                    }
                    styles="text"
                    size="small"
                    onClick={() => onClickToggle && onClickToggle(isCollapsed)}
                />
            </div>
        </div>
    );
};
