'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { IconCoachingSession } from './icons/icon-coaching-session';
import { Button } from './button';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

interface NavbarProps extends isLocalAware {
  isLoggedIn: boolean;
  notificationCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, locale, notificationCount = 0 }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dictionary = getDictionary(locale);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-transparent text-white py-2 px-4 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center">
        <Link href="/">
          <img
            src="https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png"
            width={40}
            height={40}
            alt="Logo"
          />
        </Link>
      </div>

      {/* Desktop Menu (Large Screens) */}
      <div className="hidden lg:flex items-center space-x-8 ml-auto">
        <Link href="/offers">
          <span className="hover:text-button-primary-fill cursor-pointer">
            {dictionary.components.navbar.offers}
          </span>
        </Link>
        <Link href="/coaching">
          <span className="hover:text-button-primary-fill cursor-pointer">
            {dictionary.components.navbar.coaching}
          </span>
        </Link>
        <Link href="/how-it-works">
          <span className="hover:text-button-primary-fill cursor-pointer">
            {dictionary.components.navbar.howItWorks}
          </span>
        </Link>
        <Link href="/about">
          <span className="hover:text-button-primary-fill cursor-pointer">
            {dictionary.components.navbar.about}
          </span>
        </Link>
      </div>

      {/* Right Section (Profile, Workspace, Coaching Icon, Language) */}
      <div className="hidden lg:flex items-center space-x-4">
        {isLoggedIn ? (
          <>
            <div className="relative">
              <img
                src="https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png"
                alt="User Profile"
                width={40}
                height={40}
                className="rounded-full ml-3"
              />
            </div>
            <div className="relative">
              <Link href="/workspace">
                <span className="hover:text-button-primary-fill cursor-pointer">
                  {dictionary.components.navbar.workspace}
                </span>
              </Link>
            </div>
            <div className="relative flex items-center">
              <IconCoachingSession />
              <span className="absolute -top-2 left-4 bg-button-primary-fill text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notificationCount}
              </span>
            </div>
          </>
        ) : (
          <Link href="/login">
            <Button text="Login" variant="primary" size="medium" className="ml-3" />
          </Link>
        )}
        <div className="relative">
          <select
            className="bg-card-fill text-white border border-card-stroke rounded-md px-3 py-3 focus:outline-none"
            defaultValue="ENG"
          >
            <option value="ENG">{dictionary.components.navbar.english}</option>
            <option value="DE">{dictionary.components.navbar.german}</option>
          </select>
        </div>
      </div>

      {/* Mobile Menu Button (Small Screens) */}
      <div className="lg:hidden">
        <div className="relative flex items-center space-x-4">
          {isLoggedIn && (
            <div className="flex items-center space-x-2">
              <div className="relative">
                <img
                  src="https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png"
                  alt="User Profile"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </div>
              <Link href="/workspace">
                <span className="hover:text-button-primary-fill cursor-pointer text-sm">
                  {dictionary.components.navbar.workspace}
                </span>
              </Link>
              <div className="relative flex items-center">
                <IconCoachingSession />
                <span className="absolute -top-1 left-3 bg-button-primary-fill text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {notificationCount}
                </span>
              </div>
            </div>
          )}
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-0 left-0 w-full h-full bg-button-primary-text text-white flex flex-col items-center justify-center lg:hidden">
          <div className="absolute top-4 left-0 right-0 flex justify-between items-center px-6 w-full">
            <Link href="/">
              <img
                src="https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png"
                alt="Logo"
                width={40}
                height={40}
                className="cursor-pointer"
              />
            </Link>
            <button onClick={toggleMenu} className="focus:outline-none">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex flex-col items-center space-y-6 py-4">
            <Link href="/offers">
              <span className="hover:text-button-primary-fill cursor-pointer">
                {dictionary.components.navbar.offers}
              </span>
            </Link>
            <Link href="/coaching">
              <span className="hover:text-button-primary-fill cursor-pointer">
                {dictionary.components.navbar.coaching}
              </span>
            </Link>
            <Link href="/how-it-works">
              <span className="hover:text-button-primary-fill cursor-pointer">
                {dictionary.components.navbar.howItWorks}
              </span>
            </Link>
            <Link href="/about">
              <span className="hover:text-button-primary-fill cursor-pointer">
                {dictionary.components.navbar.about}
              </span>
            </Link>

            {isLoggedIn && (
              <div className="flex flex-col items-center space-y-6">
                <div className="relative">
                  <img
                    src="https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png"
                    alt="User Profile"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
                <Link href="/workspace">
                  <span className="hover:text-button-primary-fill cursor-pointer text-lg">
                    {dictionary.components.navbar.workspace}
                  </span>
                </Link>
                <div className="relative flex items-center">
                  <IconCoachingSession />
                  <span className="absolute -top-2 left-4 bg-button-primary-fill text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notificationCount}
                  </span>
                </div>
              </div>
            )}
            <select
              className="bg-card-fill text-white border border-card-stroke rounded-md px-3 py-3 focus:outline-none"
              defaultValue="ENG"
            >
              <option value="ENG">{dictionary.components.navbar.english}</option>
              <option value="DE">{dictionary.components.navbar.german}</option>
            </select>

            {!isLoggedIn && (
              <Link href="/login">
                <Button
                  text={dictionary.components.navbar.login}
                  variant="primary"
                  size="medium"
                />
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;