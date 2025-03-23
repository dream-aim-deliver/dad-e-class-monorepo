import React, { useState, ReactNode } from 'react';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { Button } from './button';
import { Dropdown } from './dropdown';
import logo from '../images/logo.png';
import { IconClose } from './icons/icon-close';
import { IconHamburgerMenu } from './icons/icon-hamburger-menu';
import { on } from 'events';
import { IconCoachingSession } from './icons/icon-coaching-session';

interface NavbarProps extends isLocalAware {
  isLoggedIn: boolean;
  notificationCount?: number;
  onChangeLanguage?: (locale: string) => void;
  children: React.ReactNode;
  userProfile?: React.ReactNode;
  userProfileImageSrc?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  isLoggedIn,
  locale: initialLocale,
  notificationCount = 0,
  onChangeLanguage,
  children,
  userProfile,
  userProfileImageSrc = "https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png"
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState(initialLocale);
  const dictionary = getDictionary(currentLocale);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale === "en" || newLocale === "de") {
      setCurrentLocale(newLocale);
    }
    if (onChangeLanguage) {
      onChangeLanguage(newLocale);
    }
  };

  // Default user profile rendering
  const defaultUserProfile = (
    <div className="relative">
      <img
        src={userProfileImageSrc}
        alt="User Profile"
        width={40}
        height={40}
        className="rounded-full ml-3"
      />
    </div>
  );

  return (
    <nav className="bg-transparent text-white py-2 px-4 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center">
        <a href="/">
          <img
            src={logo}
            width={40}
            height={40}
            alt="Logo"
          />
        </a>
      </div>

      {/* Desktop Menu (Large Screens) */}
      <div className="hidden lg:flex items-center space-x-8 ml-auto">
        {/* Children provide navigation links */}
        {children}
      </div>

      {/* Right Section (Profile, Workspace, Language Dropdown) */}
      <div className="hidden lg:flex items-center space-x-4">
        {isLoggedIn ? (
          <>
            {/* Use custom user profile if provided, otherwise use default */}
            {userProfile || defaultUserProfile}
            <div className="relative">
              <a href="/workspace">
                <span className="hover:text-button-primary-fill cursor-pointer">
                  {dictionary.components.navbar.workspace}
                </span>
              </a>
            </div>
            {notificationCount > 0 && (
              <div className="relative flex items-center">
                <IconCoachingSession size='6' classNames='cursor-pointer' />
                <span className="absolute -top-2 left-4 bg-button-primary-fill text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              </div>
            )}
          </>
        ) : (
          <a href="/login">
            <Button text={dictionary.components.navbar.login} variant="primary" size="medium" className="ml-3" />
          </a>
        )}
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
          />
        </div>
      </div>

      {/* Mobile Menu Button (Small Screens) */}
      <div className="lg:hidden">
        <div className="relative flex items-center space-x-4">
          {isLoggedIn && (
            <div className="flex items-center space-x-2">
              {/* Mobile version of user profile */}
              <div className="relative">
                {userProfile ? (
                  // Adapt the custom profile to mobile size if provided
                  <div className="scale-75 origin-left">
                    {userProfile}
                  </div>
                ) : (
                  <img
                    src={userProfileImageSrc}
                    alt="User Profile"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
              </div>
              <a href="/workspace">
                <span className="hover:text-button-primary-fill cursor-pointer text-sm">
                  {dictionary.components.navbar.workspace}
                </span>
              </a>
              {notificationCount > 0 && (
                <div className="relative flex items-center">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute -top-1 left-3 bg-button-primary-fill text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {notificationCount}
                  </span>
                </div>
              )}
            </div>
          )}

          <Button
            onClick={toggleMenu}
            iconRight={<IconHamburgerMenu size='8' />}
            hasIconRight
            variant='text'
            size='medium'
            className='focus:outline-none p-0'
          />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-0 left-0 w-full h-full bg-button-primary-text text-white flex flex-col items-center justify-center lg:hidden">
          <div className="absolute top-4 left-0 right-0 flex justify-between items-center px-6 w-full">
            <a href="/">
              <img
                src={logo}
                alt="Logo"
                width={38}
                height={38}
                className="cursor-pointer"
              />
            </a>

            <Button
              onClick={toggleMenu}
              iconRight={<IconClose classNames='w-8 h-8' />}
              hasIconRight
              variant='text'
              size='big'
              className='focus:outline-none p-0'
            />
          </div>

          <div className="flex flex-col items-center space-y-6 py-4">
            {/* Mobile menu version of the children */}
            {children}

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
            />

            {!isLoggedIn && (
              <a href="/login">
                <Button
                  text={dictionary.components.navbar.login}
                  variant="primary"
                  size="medium"

                />
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;