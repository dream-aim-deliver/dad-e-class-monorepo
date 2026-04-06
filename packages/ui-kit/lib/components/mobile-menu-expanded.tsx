import React, { useEffect } from 'react';
import { Button } from './button';
import { IconClose } from './icons/icon-close';

interface MobileMenuExpandedProps {
  onClose: () => void;
  logoContent: React.ReactNode;
  children: React.ReactNode;
  languageSelector?: React.ReactNode;
  loginButton?: React.ReactNode;
}

export const MobileMenuExpanded: React.FC<MobileMenuExpandedProps> = ({
  onClose,
  logoContent,
  children,
  languageSelector,
  loginButton,
}) => {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-9999 text-text-primary lg:hidden">
      <div className="flex min-h-screen flex-col px-4 pb-10 pt-6 bg-base-neutral-950">
        <div className="flex items-start justify-between gap-4">
          {logoContent}

          <Button
            onClick={onClose}
            iconRight={<IconClose classNames="w-8 h-8 text-button-primary-fill" />}
            hasIconRight
            variant="text"
            size="big"
            className="p-0"
            aria-label="Close mobile menu"
          />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center text-center bg-base-neutral-950">
          <div className="flex flex-col items-stretch gap-8">
            <div className="flex flex-col items-center gap-8 [&>a]:no-underline [&>a>span]:text-2xl [&>a>span]:font-normal [&>a>span]:leading-none" onClick={onClose}>
              {children}
            </div>

            <div className="flex flex-col items-stretch gap-3">
              {languageSelector}
              {loginButton}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenuExpanded;
