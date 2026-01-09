'use client';

import React from 'react';
import { Button } from '../button';
import { IconClose } from '../icons/icon-close';
import { IconCheck } from '../icons/icon-check';
import { getDictionary, isLocalAware, TLocale } from '@maany_shr/e-class-translations';

export interface RevokeCouponModalProps extends isLocalAware {
  onConfirm: () => void;
  onCancel: () => void;
  couponName: string;
  isRevoking?: boolean;
  isSuccess?: boolean;
  errorMessage?: string | null;
}

/**
 * RevokeCouponModal component for confirming coupon revocation with success state.
 * Shows confirmation message, loading state, and success message with auto-close.
 *
 * @param onConfirm - Callback when "Yes, revoke" is clicked
 * @param onCancel - Callback when modal should close
 * @param couponName - Display the coupon name in confirmation message
 * @param locale - For translations
 * @param isRevoking - Loading state for the confirm button
 * @param isSuccess - Success state to show success message
 *
 * @example
 * <RevokeCouponModal
 *   couponName="SUMMER2024"
 *   locale="en"
 *   onConfirm={() => handleRevoke()}
 *   onCancel={() => setModalOpen(false)}
 *   isRevoking={isLoading}
 *   isSuccess={isSuccess}
 * />
 */
export const RevokeCouponModal: React.FC<RevokeCouponModalProps> = ({
  onConfirm,
  onCancel,
  couponName,
  locale,
  isRevoking = false,
  isSuccess = false,
  errorMessage = null,
}) => {
  const dictionary = getDictionary(locale).components.revokeCouponModal;

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-xs flex items-center justify-center z-50" onClick={onCancel}>
      <div className="flex flex-col gap-4 p-6 bg-card-fill border border-card-stroke text-text-primary w-full max-w-[400px] rounded-md" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{dictionary.title}</h2>
          <Button 
            variant="text" 
            size="small" 
            hasIconLeft 
            iconLeft={<IconClose size="6" />} 
            onClick={onCancel}
            disabled={isRevoking}
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4">
          {isSuccess ? (
            // Success State
            <div className="flex flex-col items-center gap-4 py-4">
              <p className="text-center text-text-primary">
                {dictionary.successMessage.replace('{couponName}', couponName)}
              </p>
            </div>
          ) : (
            // Confirmation State
            <div className="flex flex-col gap-4">
              <p className="text-text-primary">
                {dictionary.confirmMessage.replace('{couponName}', couponName)}
              </p>
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800 text-sm">{errorMessage}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Buttons - Hidden when success */}
        {!isSuccess && (
          <>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="medium"
                onClick={onCancel}
                className="flex-1"
                text={dictionary.cancelButton}
                disabled={isRevoking}
              />
              <Button
                variant="primary"
                size="medium"
                onClick={onConfirm}
                className="flex-1"
                text={isRevoking ? dictionary.revoking : dictionary.confirmButton}
                disabled={isRevoking}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

