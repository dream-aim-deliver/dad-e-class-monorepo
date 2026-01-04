'use client';

import React, { useState, useRef, useEffect } from 'react';
import { getDictionary, isLocalAware, TLocale } from '@maany_shr/e-class-translations';
import { Button } from './button';
import { Dropdown } from './dropdown';
import { IconClose } from './icons/icon-close';
import { IconHamburgerMenu } from './icons/icon-hamburger-menu';
import { IconChat } from './icons/icon-chat';
import { IconChevronDown } from './icons/icon-chevron-down';
import { UserAvatar } from './avatar/user-avatar';
import DefaultLoading from './default-loading';
import { useImageComponent } from '../contexts/image-component-context';

interface NavbarProps extends isLocalAware {
  isLoggedIn: boolean;
  notificationCount?: number;
  onChangeLanguage?: (locale: string) => void;
  onLogin?: () => void;
  onLogout?: () => void;
  isLoggingOut?: boolean;
  children: React.ReactNode;
  logo?: React.ReactNode;
  userProfile?: React.ReactNode;
  userProfileImageSrc?: string;
  userName?: string;
  logoSrc?: string;
  availableLocales: TLocale[];
  dropdownOptions?: { label: string; value: string }[];
  onDropdownSelection?: (selected: string) => void;
  dropdownTriggerText?: string;
  onNotificationClick?: () => void;
}

interface NavBarDropdownProps {
  options: { label: string; value: string }[];
  onSelectionChange: (selected: string) => void;
  triggerText: string;
  className?: string;
  isMobile?: boolean;
}

const NavBarDropdown: React.FC<NavBarDropdownProps> = ({
  options,
  onSelectionChange,
  triggerText,
  className = '',
  isMobile = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150); // Small delay to prevent flickering
  };

  const handleOptionClick = (value: string) => {
    onSelectionChange(value);
    setIsOpen(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={dropdownRef}
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger */}
      <div className={`flex items-center space-x-1 hover:text-button-primary-fill cursor-pointer ${isMobile ? 'text-sm' : ''}`}>
        {triggerText && <span>{triggerText}</span>}
        <IconChevronDown classNames="w-4 h-4 fill-current" />
      </div>

      {/* Dropdown Content */}
      {isOpen && options.length > 0 && (
        <div className="absolute top-full right-0 mt-3 py-2 bg-base-neutral-800 border-[1px] border-base-neutral-700 rounded-medium shadow-lg z-50 min-w-[150px]">
          {options.map((option) => (
            <div key={option.value}>
              {/* Add divider before logout */}
              {option.value === 'logout' && (
                <div className="h-[1px] bg-base-neutral-600 mx-2 my-1" />
              )}
              <div
                className="py-2 px-4 cursor-pointer hover:bg-base-neutral-700 text-sm text-text-primary whitespace-nowrap"
                onClick={() => handleOptionClick(option.value)}
              >
                {option.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * A responsive Navbar component for the e-class platform.
 *
 * @param isLoggedIn Indicates whether the user is logged in.
 * @param locale The current locale for the navbar, determining the language of displayed text.
 * @param notificationCount The number of unread notifications.
 * @param onChangeLanguage Callback function triggered when the language is changed. Receives the new locale as an argument.
 * @param children The children elements to be rendered in the Navbar.
 * @param userProfile The user profile component to be rendered in the Navbar.
 * @param userProfileImageSrc The URL of the user's profile image.
 * @param userName The user's full name.
 * @param logoSrc The URL of the platform's logo.
 * @param logo Optional React node to render as the logo, which can be an image or any other element.
 * @param availableLocales An array of available locales for the language dropdown.
 * @param dropdownOptions Optional array of dropdown menu options with label and value properties.
 * @param onDropdownSelection Optional callback function triggered when a dropdown option is selected. Receives the selected value as an argument.
 * @param dropdownTriggerText Optional text to display as the dropdown trigger. Can be an empty string to show only the chevron icon.
 *
 * @example
 * <Navbar
 *   isLoggedIn={true}
 *   locale="en"
 *   notificationCount={3}
 *   onChangeLanguage={(locale) => console.log("Language changed to:", locale)}
 *   userProfile={<UserAvatar imageUrl="https://example.com/avatar.jpg" size="small" fullName="John Doe" />}
 *   userProfileImageSrc="https://example.com/avatar.jpg"
 *   userName="John Doe"
 *   logoSrc="https://example.com/logo.png"
 *   availableLocales={['en', 'de']}
 *   dropdownOptions={[
 *     { label: "Dashboard", value: "dashboard" },
 *     { label: "Profile", value: "profile" },
 *     { label: "Logout", value: "logout" }
 *   ]}
 *   onDropdownSelection={(selected) => console.log("Dropdown selection:", selected)}
 *   dropdownTriggerText="Workspace"
 * >
 *   <a href="/courses">Courses</a>
 *   <a href="/profile">Profile</a>
 * </Navbar>
 */
export const Navbar: React.FC<NavbarProps> = ({
  isLoggedIn,
  locale,
  notificationCount = 0,
  onChangeLanguage,
  onLogin,
  onLogout,
  isLoggingOut = false,
  children,
  userProfile,
  userProfileImageSrc,
  userName,
  logo,
  logoSrc,
  availableLocales,
  dropdownOptions = [],
  onDropdownSelection,
  dropdownTriggerText = '',
  onNotificationClick,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dictionary = getDictionary(locale);
  const ImageComponent = useImageComponent();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLocaleChange = (newLocale: TLocale) => {
    if (availableLocales.includes(newLocale) && onChangeLanguage) {
      onChangeLanguage(newLocale);
    }
  };

  const languageOptions = availableLocales.map((locale) => ({
    label: locale.toUpperCase(),
    value: locale,
  }));

  const handleDropdownSelection = (selected: string) => {
    if (selected === 'logout' && onLogout) {
      onLogout();
    } else if (onDropdownSelection) {
      onDropdownSelection(selected);
    }
  };

  const defaultUserProfile = (
    <div className="flex items-center space-x-2">
      <UserAvatar
        imageUrl={userProfileImageSrc}
        size="small"
        fullName={userName}
        className="p-0 ml-3"
      />
      <NavBarDropdown
        options={dropdownOptions}
        onSelectionChange={handleDropdownSelection}
        triggerText={dropdownTriggerText}
      />
    </div>
  );

  const formatNotificationCount = (count: number) => {
    if (count > 99) return '99+';
    return count.toString();
  };

  return (
    <nav className="bg-neutral-950/50 backdrop-blur-md text-text-primary py-3 px-14 flex items-center justify-between w-full fixed top-0 z-1000">
      {/* Logo */}
      <div className="flex items-center">
        <a href="/" className="block h-12">
          {logo}
          {logoSrc && <ImageComponent
            src={logoSrc}
            alt="Logo"
            className="h-full w-auto"
          />}
        </a>
      </div>

      {/* Desktop Menu (Large Screens) */}
      <div className="hidden lg:flex items-center space-x-6 ml-auto">{children}</div>

      {/* Right Section (Profile+Workspace, Chat, Language Dropdown) */}
      <div className="hidden lg:flex items-center space-x-3 ml-3">
        {isLoggedIn ? (
          <>
            {userProfile || defaultUserProfile}
            <div
              className="relative flex items-center"
              onClick={onNotificationClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onNotificationClick?.()}
            >
              <IconChat size="6" classNames="cursor-pointer" />
              {notificationCount > 0 && (
                <span className="absolute p-2 -top-4 left-4 leading-[150%] font-bold bg-button-primary-fill text-black text-xs rounded-full h-6 w-6 flex items-center justify-center overflow-hidden">
                  {formatNotificationCount(notificationCount)}
                </span>
              )}
            </div>
          </>
        ) : (
          onLogin ? (
            <Button
              text={dictionary.components.navbar.login}
              variant="primary"
              size="medium"
              className="ml-3"
              onClick={onLogin}
            />
          ) : (
            <a href="/auth/login">
              <Button
                text={dictionary.components.navbar.login}
                variant="primary"
                size="medium"
                className="ml-3"
              />
            </a>
          )
        )}
        {availableLocales && availableLocales.length > 1 && 
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
            />
          </div>
        }
      </div>

      {/* Mobile Menu Button (Small Screens) */}
      <div className="lg:hidden">
        <div className="relative flex items-center space-x-4">
          {isLoggedIn && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {userProfile ? (
                  <div className="scale-75 origin-left">{userProfile}</div>
                ) : (
                  <UserAvatar
                    imageUrl={userProfileImageSrc}
                    size="small"
                    fullName={userName}
                    className="ml-1"
                  />
                )}
                <NavBarDropdown
                  options={dropdownOptions}
                  onSelectionChange={handleDropdownSelection}
                  triggerText={dropdownTriggerText}
                  isMobile={true}
                />
              </div>
              <div
                className="relative flex items-center"
                onClick={onNotificationClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onNotificationClick?.()}
              >
                <IconChat size="6" classNames="cursor-pointer" />
                {notificationCount > 0 && (
                  <span className="absolute p-2 -top-4 left-4 leading-[150%] font-bold bg-button-primary-fill text-black text-xs rounded-full h-6 w-6 flex items-center justify-center overflow-hidden">
                    {formatNotificationCount(notificationCount)}
                  </span>
                )}
              </div>
            </div>
          )}

          <Button
            onClick={toggleMenu}
            iconRight={<IconHamburgerMenu size="8" />}
            hasIconRight
            variant="text"
            size="medium"
            className="focus:outline-none p-0"
          />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-button-primary-text text-white flex flex-col items-center justify-center lg:hidden z-9999"
        >
          <div className="absolute top-3 left-0 right-0 flex justify-between items-center px-4 w-full">
            <a href="/" className="block h-12">
              {logo}
              {logoSrc && <ImageComponent
                src={logoSrc}
                alt="Logo"
                className="h-full w-auto"
              />}
            </a>

            <Button
              onClick={toggleMenu}
              iconRight={<IconClose classNames="w-8 h-8" />}
              hasIconRight
              variant="text"
              size="big"
              className="focus:outline-none p-0"
            />
          </div>

          <div className="flex flex-col items-center space-y-6 py-4">
            {children}
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
            />
            {!isLoggedIn && (
              onLogin ? (
                <Button
                  text={dictionary.components.navbar.login}
                  variant="primary"
                  size="medium"
                  onClick={onLogin}
                />
              ) : (
                <a href="/auth/login">
                  <Button
                    text={dictionary.components.navbar.login}
                    variant="primary"
                    size="medium"
                  />
                </a>
              )
            )}
          </div>
        </div>
      )}
      
      {/* Logout Loading Overlay */}
      {isLoggingOut && (
        <DefaultLoading 
          locale={locale} 
          variant="overlay"
        />
      )}
    </nav>
  );
};

export default Navbar;
