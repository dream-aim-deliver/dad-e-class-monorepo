import React from 'react';
import { getDictionary, isLocalAware, TLocale } from '@maany_shr/e-class-translations';
import { Dropdown } from './dropdown';

interface FooterProps extends isLocalAware {
    logoSrc?: string;
    onChangeLanguage?: (locale: string) => void;
    children?: React.ReactNode;
    footerChildren?: React.ReactNode;
    availableLocales: TLocale[];
}

/**
 * A reusable Footer component that displays a logo, navigation links, company information, and a language dropdown.
 * Supports responsive layouts for mobile and desktop screens, with localization capabilities.
 *
 * @param locale The current locale for the footer, determining the language of displayed text.
 * @param logoSrc Optional URL for the logo image displayed in the footer.
 * @param onChangeLanguage Optional callback function triggered when the language is changed.
 * @param children Optional React nodes to render as navigation links in the footer.
 * @param footerChildren Optional React nodes to render as company information.
 * @param availableLocales An array of available locales for the language dropdown.
 *
 * @example
 * <Footer
 *   locale="en"
 *   logoSrc="https://example.com/logo.png"
 *   onChangeLanguage={(newLocale) => console.log(`Language changed to: ${newLocale}`)}
 *   availableLocales={['en', 'de']}
 *   children={
 *     <>
 *       <a href="/about">About</a>
 *       <a href="/contact">Contact</a>
 *     </>
 *   }
 *   footerChildren={<span>© 2024 MyCompany</span>}
 * />
 */
export const Footer: React.FC<FooterProps> = ({
    locale,
    logoSrc,
    onChangeLanguage,
    children,
    footerChildren,
    availableLocales,
}) => {
    const dictionary = getDictionary(locale);

    const handleLocaleChange = (newLocale: TLocale) => {
        if (availableLocales.includes(newLocale) && onChangeLanguage) {
            onChangeLanguage(newLocale);
        }
    };

    // Create language options from availableLocales
    const languageOptions = availableLocales.map((locale) => ({
        label: locale.toUpperCase(),
        value: locale,
    }));

    return (
        <footer className="w-full bg-button-primary-text text-white">
            <div className="max-w-7xl mx-auto">
                {/* Mobile Layout (Smaller Screens) */}
                <div className="flex flex-col py-10 px-4 lg:!hidden">
                    {/* Top Section: Logo (Left) and Company Info (Right) */}
                    <div className="flex justify-between items-start">
                        {/* Logo (Left) */}
                        <div className="w-1/2">
                            <a href="/">
                                {logoSrc && (
                                    <img
                                        src={logoSrc}
                                        width={40}
                                        height={40}
                                        alt="Logo"
                                        className="mb-2"
                                    />
                                )}
                            </a>
                        </div>

                        {/* Company Info (Right) */}
                        <div className="text-text-secondary text-sm text-right">
                            <span>{footerChildren}</span>
                        </div>
                    </div>
                    <hr className="border-divider my-6" />
                    {/* Bottom Section: Navigation Links and Language Dropdown */}
                    <div className="flex items-center justify-between">
                        {/* Navigation Links */}
                        {children && (
                            <div className="flex flex-wrap gap-x-4 gap-y-2 text-button-primary-fill text-sm">
                                {children}
                            </div>
                        )}

                        {/* Language Dropdown */}
                        <div className="relative flex items-center">
                            <Dropdown
                                type="simple"
                                options={languageOptions}
                                onSelectionChange={(selected) => {
                                    if (
                                        typeof selected === 'string' &&
                                        availableLocales.includes(selected as TLocale)
                                    ) {
                                        handleLocaleChange(selected as TLocale);
                                    }
                                }}
                                text={{ simpleText: '' }}
                                defaultValue={locale}
                                position="top"
                            />
                        </div>
                    </div>
                </div>

                {/* Desktop Layout (Larger Screens) */}
                <div className="hidden py-6 px-10.5 lg:!flex flex-row justify-between items-start lg:items-center">
                    {/* Left Section: Logo Only */}
                    <div className="mb-6 lg:!mb-0">
                        <a href="/">
                            {logoSrc && (
                                <img
                                    src={logoSrc}
                                    width={40}
                                    height={40}
                                    alt="Logo"
                                    className="mb-2"
                                />
                            )}
                        </a>
                    </div>

                    {/* Right Section: Navigation Links, Company Info, and Language Dropdown */}
                    <div className="flex flex-col lg:!flex-row items-end lg:!items-center space-y-4 lg:!space-y-0 lg:!space-x-8">
                        <div className="flex flex-col gap-4">
                            {/* Navigation Links */}
                            {children && (
                                <div className="flex flex-col items-end justify-end lg:!flex-row flex-wrap gap-4">
                                    {children}
                                </div>
                            )}

                            {/* Company Info */}
                            <div className="text-text-secondary text-sm leading-[150%] items-end flex justify-end">
                                <span>{footerChildren}</span>
                            </div>
                        </div>

                        {/* Language Dropdown */}
                        <div className="relative">
                            <Dropdown
                                type="simple"
                                options={languageOptions}
                                onSelectionChange={(selected) => {
                                    if (
                                        typeof selected === 'string' &&
                                        availableLocales.includes(selected as TLocale)
                                    ) {
                                        handleLocaleChange(selected as TLocale);
                                    }
                                }}
                                text={{ simpleText: '' }}
                                defaultValue={locale}
                                position="top"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
