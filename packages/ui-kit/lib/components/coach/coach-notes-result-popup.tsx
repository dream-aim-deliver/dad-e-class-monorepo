'use client';

import * as React from 'react';
import { Button } from '../button';
import { IconSuccess } from '../icons/icon-success';
import { IconError } from '../icons/icon-error';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { Dialog, DialogContent } from '../dialog';
import { IconButton } from '../icon-button';
import { IconClose } from '../icons';

export interface CoachNotesResultPopupProps extends isLocalAware {
  onClose: () => void;
  isSuccess: boolean;
  isError: boolean;
}

/**
 * A popup component for showing success or error results after saving coach notes.
 * 
 * @param onClose Callback function triggered when the popup is closed
 * @param isSuccess Boolean indicating if the operation was successful
 * @param isError Boolean indicating if there was an error
 * @param locale The locale used for translations
 */
export const CoachNotesResultPopup: React.FC<CoachNotesResultPopupProps> = ({
  onClose,
  isSuccess,
  isError,
  locale,
}) => {
  const dictionary = getDictionary(locale);

  const successContent = (
    <div className="flex flex-col w-full gap-6">
      <div className="flex items-start gap-4 w-full">
        <div className="flex flex-col gap-4 w-full">
          <IconSuccess classNames="text-feedback-success-primary" />
          <h5 className="text-lg text-base-white text-justify leading-none">
            {dictionary.components.coachNotes.successMessage}
          </h5>
        </div>
      </div>

      <Button
        className="w-full mt-4"
        variant="primary"
        size="medium"
        text={dictionary.components.coachNotes.closeButton}
        onClick={onClose}
      />
    </div>
  );

  const errorContent = (
    <div className="flex flex-col w-full gap-6">
      <div className="flex items-start gap-4 w-full">
        <div className="flex flex-col gap-4 w-full">
          <IconError classNames="text-feedback-error-primary" />
          <h5 className="text-lg text-base-white text-justify leading-none">
            {dictionary.components.coachNotes.errorMessage}
          </h5>
        </div>
      </div>
        <Button
            className="w-full"
            variant="secondary"
            size="medium"
            text={dictionary.components.coachNotes.closeButton}
            onClick={onClose}
        />
    </div>
  );

  if (!isSuccess && !isError) {
    return null;
  }

  return (
    <div className="flex flex-col items-end gap-4 p-6 rounded-lg border border-card-stroke bg-card-fill w-full md:w-[340px] shadow-[0_4px_12px_rgba(12,10,9,1)] relative">
        <div className="absolute right-0 top-0">
            <IconButton
                data-testid="close-modal-button"
                styles="text"
                icon={<IconClose />}
                size="small"
                onClick={onClose}
                className="text-button-text-text"
            />
        </div>
        {isSuccess ? successContent : errorContent}
    </div>
  );
};