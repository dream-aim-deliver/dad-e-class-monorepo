import React, { useState, ReactNode } from 'react';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { Button } from './button';
import { Dropdown } from './dropdown';
import { IconClose } from './icons/icon-close';
import { IconHamburgerMenu } from './icons/icon-hamburger-menu';
import { IconChat } from './icons/icon-chat';
import { UserAvatar } from './avatar/user-avatar';

interface NavbarProps extends isLocalAware {
  isLoggedIn: boolean;
  notificationCount?: number;
  onChangeLanguage?: (locale: string) => void;
  children: React.ReactNode;
  userProfile?: React.ReactNode;
  userProfileImageSrc?: string;
  userName?: string;
  logoSrc?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  isLoggedIn,
  locale: initialLocale,
  notificationCount = 0,
  onChangeLanguage,
  children,
  userProfile,
  userProfileImageSrc,
  userName,
  logoSrc,
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

  const defaultUserProfile = (
    <div className="relative">
      <UserAvatar
        imageUrl={userProfileImageSrc}
        size="small"
        fullName={userName}
        className='ml-3 p-0'
      />
    </div>
  );

  const formatNotificationCount = (count: number) => {
    if (count > 99) return "99+";
    return count.toString();
  };

  return (
    <nav className="bg-transparent text-white py-4 px-4 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center">
        <a href="/">
          <img
            src={logoSrc}
            width={40}
            height={40}
            alt="Logo"
          />
        </a>
      </div>

      {/* Desktop Menu (Large Screens) */}
      <div className="hidden lg:flex items-center space-x-6 ml-auto">
        {children}
      </div>

      {/* Right Section (Profile, Workspace, Language Dropdown) */}
      <div className="hidden lg:flex items-center space-x-6 ml-2.5">
        {isLoggedIn ? (
          <>
            {userProfile || defaultUserProfile}
            <div className="relative">
              <a href="/workspace">
                <span className="hover:text-button-primary-fill cursor-pointer">
                  {dictionary.components.navbar.workspace}
                </span>
              </a>
            </div>
            <div className="relative flex items-center">
              <IconChat size='6' classNames='cursor-pointer' />
              {notificationCount > 0 &&
                <span className="absolute p-2 -top-4 left-4 leading-[150%] font-bold bg-button-primary-fill text-black text-xs rounded-full h-6 w-6 flex items-center justify-center overflow-hidden ">
                  {formatNotificationCount(notificationCount)}
                </span>
              }
            </div>
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
            <div className="flex items-center space-x-4"> {/* Changed space-x-2 to space-x-4 */}
              <div className="relative">
                {userProfile ? (
                  <div className="scale-75 origin-left">
                    {userProfile}
                  </div>
                ) : (
                  <UserAvatar
                    imageUrl={userProfileImageSrc}
                    size="small"
                    fullName={userName}
                    className='ml-1'
                  />
                )}
              </div>
              <a href="/workspace">
                <span className="hover:text-button-primary-fill cursor-pointer text-sm">
                  {dictionary.components.navbar.workspace}
                </span>
              </a>
              <div className="relative flex items-center">
                <IconChat size='6' classNames='cursor-pointer' />
                {notificationCount > 0 &&
                  <span className="absolute p-2 -top-4 left-4 leading-[150%] font-bold bg-button-primary-fill text-black text-xs rounded-full h-6 w-6 flex items-center justify-center overflow-hidden ">
                    {formatNotificationCount(notificationCount)}
                  </span>
                }
              </div>
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
                src={logoSrc}
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