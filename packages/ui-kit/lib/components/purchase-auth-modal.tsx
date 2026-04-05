'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { Button } from './button';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { Z_INDEX } from '../utils/z-index';

export interface PurchaseAuthModalProps extends isLocalAware {
    isOpen: boolean;
    onLogin: () => void;
    onCancel: () => void;
}

export const PurchaseAuthModal: React.FC<PurchaseAuthModalProps> = ({
    isOpen,
    onLogin,
    onCancel,
    locale,
}) => {
    const dictionary = getDictionary(locale);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: Z_INDEX.DIALOG }}>
            <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" />
            <div className="relative flex flex-col items-end gap-4 p-6 rounded-lg border border-card-stroke bg-card-fill shadow-[0_4px_12px_rgba(12,10,9,1)] max-w-[400px] w-full">
                <div className="flex flex-col gap-4 w-full">
                    <p className="text-xl font-semibold text-text-primary">
                        {dictionary.components.purchaseAuthModal.title}
                    </p>
                    <p className="text-sm text-text-secondary">
                        {dictionary.components.purchaseAuthModal.message}
                    </p>
                    <div className="flex items-center w-full pt-2 flex-col gap-2">
                        <Button
                            className="w-full"
                            variant="primary"
                            size="medium"
                            text={dictionary.components.purchaseAuthModal.loginButtonText}
                            onClick={onLogin}
                        />
                        <Button
                            className="w-full"
                            variant="secondary"
                            size="medium"
                            text={dictionary.components.purchaseAuthModal.cancelButtonText}
                            onClick={onCancel}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
