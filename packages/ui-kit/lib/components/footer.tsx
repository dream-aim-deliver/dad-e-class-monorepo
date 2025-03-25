// Footer.tsx
import React, { useRef, useState } from 'react';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { Dropdown } from './dropdown';
import { Button } from './button';

interface FooterProps extends isLocalAware {
    logoSrc?: string;
    onChangeLanguage?: (locale: string) => void;
    children?: React.ReactNode;
}

export const Footer: React.FC<FooterProps> = ({
    locale: initialLocale,
    logoSrc,
    onChangeLanguage,
    children,
}) => {
    const [currentLocale, setCurrentLocale] = useState(initialLocale);
    const dictionary = getDictionary(currentLocale);

    const handleLocaleChange = (newLocale: string) => {
        if (newLocale === "en" || newLocale === "de") {
            setCurrentLocale(newLocale);
        }
        if (onChangeLanguage) {
            onChangeLanguage(newLocale);
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
                        <div className="w-1/2">2
                            <a href="/">
                                {logoSrc ? (
                                    <img
                                        src={logoSrc}
                                        width={40}
                                        height={40}
                                        alt="Logo"
                                        className="mb-2 flex-shrink-0"
                                    />
                                ) : (
                                    <div className="text-4xl font-bold mb-2">
                                        <span className="text-white">JUST</span>
                                        <span className="text-white">DO</span>
                                        <span className="text-orange-500">AD.</span>
                                    </div>
                                )}
                            </a>
                        </div>

                        {/* Company Info (Right) */}
                        <div className="text-gray-400 text-sm text-right">
                            <span>
                                © 2024 JUST DO AD GmbH • Hermetschloostrasse 70, 8048 Zürich • hi@justdoad.ai
                            </span>
                        </div>
                    </div>
                    <hr className="border-divider my-6" />            
                    {/* Bottom Section: Navigation Links (Two Rows, Left) and Language Dropdown (Centered, Right) */}
                    <div className="flex items-center justify-between">
                        {/* Navigation Links (Two Rows, Left-Aligned) */}
                        {children && (
                            <div className="flex flex-wrap gap-x-4 gap-y-2 text-orange-500 text-sm">
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
                                    if (typeof selected === 'string') {
                                        handleLocaleChange(selected);
                                    }
                                }}
                                text={{ simpleText: "" }}
                                defaultValue={currentLocale}
                                position='top'
                            />
                        </div>
                    </div>
                </div>

                {/* Desktop Layout (Larger Screens) */}
                <div className="hidden py-6 px-10.5 lg:flex flex-row justify-between items-start lg:items-center">
                    {/* Left Section: Logo Only */}
                    <div className="mb-6 lg:mb-0">
                        <a href="/">
                            {logoSrc ? (
                                <img
                                    src={logoSrc}
                                    width={40}
                                    height={40}
                                    alt="Logo"
                                    className="mb-2"
                                />
                            ) : (
                                <div className="text-4xl font-bold mb-2">
                                    <span className="text-white">JUST</span>
                                    <span className="text-white">DO</span>
                                    <span className="text-orange-500">AD.</span>
                                </div>
                            )}
                        </a>
                    </div>

                    {/* Right Section: Navigation Links, Company Info, and Language Dropdown */}
                    <div className="flex flex-col lg:flex-row items-end lg:items-center space-y-4 lg:space-y-0 lg:space-x-8">
                        <div className="flex flex-col gap-4">
                            {/* Navigation Links */}
                            {children && (
                                <div className="flex flex-col items-end justify-end lg:flex-row flex-wrap gap-4 text-orange-500 text-sm">
                                    {children}
                                </div>
                            )}

                            {/* Company Info in One Line */}
                            <div className="text-gray-400 text-sm">
                                <span>
                                    © 2024 JUST DO AD GmbH • Hermetschloostrasse 70, 8048 Zürich • hi@justdoad.ai
                                </span>
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
                                    if (typeof selected === 'string') {
                                        handleLocaleChange(selected);
                                    }
                                }}
                                text={{ simpleText: "" }}
                                defaultValue={currentLocale}
                                position='top'
                            />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;