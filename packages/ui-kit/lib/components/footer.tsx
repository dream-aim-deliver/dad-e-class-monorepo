import React, { useState } from 'react';
import { getDictionary, isLocalAware, locales, TLocale } from '@maany_shr/e-class-translations';
import { Dropdown } from './dropdown';
import { Button } from './button';

interface FooterProps extends isLocalAware {
    logoSrc?: string;
    onChangeLanguage?: (locale: string) => void;
    children?: React.ReactNode;
    footerChildren?: React.ReactNode;
}

/**
 * A reusable Footer component that displays a logo, navigation links, company information, and a language dropdown.
 * Supports responsive layouts for mobile and desktop screens, with localization capabilities.
 *
 * @param locale The initial locale for the footer, determining the language of displayed text. Must be one of:
 *   - `en`: English (default).
 *   - `de`: German.
 *   Inherited from `isLocalAware` interface via `@maany_shr/e-class-translations`.
 * @param logoSrc Optional URL for the logo image displayed in the footer. If not provided, no logo is shown.
 * @param onChangeLanguage Optional callback function triggered when the language is changed via the dropdown.
 *   Receives the new locale as a string (e.g., `"en"` or `"de"`).
 * @param children Optional React nodes to render as navigation links in the footer.
 *   Typically `<a>` elements, which are styled automatically with `text-button-primary-fill hover:text-button-primary-hover-fill cursor-pointer text-sm`.
 * @param footerChildren Optional React nodes to render as company information (e.g., copyright text) in the footer.
 *
 * @example
 * <Footer
 *   locale="en"
 *   logoSrc="https://example.com/logo.png"
 *   onChangeLanguage={(newLocale) => console.log(`Language changed to: ${newLocale}`)}
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
    locale: initialLocale,
    logoSrc,
    onChangeLanguage,
    children,
    footerChildren,
}) => {
    const [currentLocale, setCurrentLocale] = useState<TLocale>(initialLocale);
    const dictionary = getDictionary(currentLocale);

    const handleLocaleChange = (newLocale: TLocale) => {
        if (locales.includes(newLocale)) { // Use locales from e-class-translations for validation
            setCurrentLocale(newLocale);
            if (onChangeLanguage) {
                onChangeLanguage(newLocale);
            }
        }
    };

    return (
        <footer className="bg-button-primary-text text-white">
            <div className="max-w-7xl mx-auto">
                {/* Mobile Layout (Smaller Screens) */}
                <div className="flex flex-col py-10 px-4 lg:hidden">
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
                    {/* Bottom Section: Navigation Links (Two Rows, Left) and Language Dropdown (Centered, Right) */}
                    <div className="flex items-center justify-between">
                        {/* Navigation Links (Two Rows, Left-Aligned) */}
                        {children && (
                            <div className="flex flex-wrap gap-x-4 gap-y-2 text-button-primary-fill text-sm">
                                {children}
                            </div>
                        )}

                        {/* Language Dropdown (Centered Vertically, Right) */}
                        <div className="relative flex items-center">
                            <Dropdown
                                type="simple"
                                options={[
                                    { label: "ENG", value: "en" },
                                    { label: "DE", value: "de" },
                                ]}
                                onSelectionChange={(selected) => {
                                    if (typeof selected === 'string' && locales.includes(selected as TLocale)) {
                                        handleLocaleChange(selected as TLocale);
                                    }
                                }}
                                text={{ simpleText: "" }}
                                defaultValue={currentLocale}
                                position="top"
                            />
                        </div>
                    </div>
                </div>

                {/* Desktop Layout (Larger Screens) */}
                <div className="hidden py-6 px-10.5 lg:flex flex-row justify-between items-start lg:items-center">
                    {/* Left Section: Logo Only */}
                    <div className="mb-6 lg:mb-0">
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
                    <div className="flex flex-col lg:flex-row items-end lg:items-center space-y-4 lg:space-y-0 lg:space-x-8">
                        <div className="flex flex-col gap-4">
                            {/* Navigation Links */}
                            {children && (
                                <div className="flex flex-col items-end justify-end lg:flex-row flex-wrap gap-4">
                                    {children}
                                </div>
                            )}

                            {/* Company Info in One Line */}
                            <div className="text-text-secondary text-sm leading-[150%] items-end flex justify-end">
                                <span>{footerChildren}</span>
                            </div>
                        </div>

                        {/* Language Dropdown */}
                        <div className="relative">
                            <Dropdown
                                type="simple"
                                options={[
                                    { label: "ENG", value: "en" },
                                    { label: "DE", value: "de" },
                                ]}
                                onSelectionChange={(selected) => {
                                    if (typeof selected === 'string' && locales.includes(selected as TLocale)) {
                                        handleLocaleChange(selected as TLocale);
                                    }
                                }}
                                text={{ simpleText: "" }}
                                defaultValue={currentLocale}
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