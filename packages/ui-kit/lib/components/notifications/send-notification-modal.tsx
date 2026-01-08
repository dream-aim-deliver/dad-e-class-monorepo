'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Button } from '../button';
import { TextAreaInput } from '../text-areaInput';
import { InputField } from '../input-field';
import { Activity } from './activity';
import { BaseGrid } from '../grids/base-grid';
import { Badge } from '../badge';
import { FeedBackMessage } from '../feedback-message';
import { IconChevronRight } from '../icons/icon-chevron-right';
import { IconSendEmail } from '../icons/icon-send-email';
import { IconClose } from '../icons/icon-close';
import { getDictionary, isLocalAware, TLocale, dictionaryFormat } from '@maany_shr/e-class-translations';
import type { UserRow } from '../grids/user-grid';
import { ColDef } from 'ag-grid-community';

export interface SendNotificationModalProps extends isLocalAware {
  isOpen: boolean;
  onClose: () => void;
  recipients: UserRow[];
  onSendNotification: (data: { userIds: number[]; notification: { message: string; actionTitle: string; actionUrl: string; sendEmail: boolean } }) => Promise<void> | void;
  isSending?: boolean;
  isSuccess?: boolean;
  recipientCount?: number;
}

type Step = 1 | 2 | 3;

export const SendNotificationModal: React.FC<SendNotificationModalProps> = ({
  isOpen,
  onClose,
  recipients,
  onSendNotification,
  isSending = false,
  isSuccess = false,
  recipientCount,
  locale,
}) => {
  const dictionary = getDictionary(locale).components.sendNotificationModal;
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [message, setMessage] = useState('');
  const [actionTitle, setActionTitle] = useState('');
  const [actionUrl, setActionUrl] = useState('');
  const [sendEmail, setSendEmail] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recipientsGridRef = useRef<AgGridReact | null>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setMessage('');
      setActionTitle('');
      setActionUrl('');
      setSendEmail(false);
      setHasAttemptedSubmit(false);
      setErrorMessage(null);
    }
  }, [isOpen]);

  // Move to success step when mutation succeeds
  useEffect(() => {
    if (isSuccess && currentStep === 2) {
      setCurrentStep(3);
    }
  }, [isSuccess, currentStep]);

  // URL validation helper
  const isValidUrl = (url: string): boolean => {
    if (!url || url.trim().length === 0) return false;
    try {
      // Try with the URL as-is
      new URL(url);
      return true;
    } catch {
      // If it fails, try adding https:// prefix (common user error)
      try {
        new URL(`https://${url}`);
        return true;
      } catch {
        return false;
      }
    }
  };

  // Validation
  const isMessageValid = message.trim().length > 0 && message.trim().length <= 120;
  const isActionTitleValid = actionTitle.trim().length > 0;
  const isActionUrlValid = actionUrl.trim().length > 0 && isValidUrl(actionUrl.trim());
  const isFormValid = isMessageValid && isActionTitleValid && isActionUrlValid && recipients.length > 0;

  // Recipients grid column definitions
  const recipientsColumnDefs = useMemo<ColDef[]>(() => [
    {
      field: 'name',
      headerName: dictionary.nameColumn || 'Name',
      filter: 'agTextColumnFilter',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'surname',
      headerName: dictionary.surnameColumn || 'Surname',
      filter: 'agTextColumnFilter',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'type',
      headerName: dictionary.typeColumn || 'Type',
      valueGetter: (params: any) => {
        const user: UserRow = params.data;
        return getUserType(user);
      },
      filter: 'agTextColumnFilter',
      flex: 1,
      minWidth: 150,
    },
  ], [dictionary]);

  // Helper function to get user type
  const getUserType = (user: UserRow): string => {
    if (!user.roles || user.roles.length === 0) return 'Student';
    
    const roleTypes = user.roles.map(r => r.role.toLowerCase());
    if (roleTypes.includes('super_admin') || roleTypes.includes('admin')) return 'Admin';
    if (roleTypes.includes('course creator')) return 'Course Creator';
    if (roleTypes.includes('coach')) return 'Coach';
    return 'Student';
  };

  // Handle next step
  const handleNext = () => {
    if (!isFormValid) {
      setHasAttemptedSubmit(true);
      return;
    }
    setCurrentStep(2);
  };

  // Handle back to step 1
  const handleBack = () => {
    setCurrentStep(1);
  };

  // Handle send notification
  const handleSend = async () => {
    if (!isFormValid) {
      setHasAttemptedSubmit(true);
      return;
    }

    setErrorMessage(null);
    const userIds = recipients.map(r => r.userId);
    
    try {
      await onSendNotification({
        userIds,
        notification: {
          message: message.trim(),
          actionTitle: actionTitle.trim(),
          actionUrl: actionUrl.trim(),
          sendEmail,
        },
      });
    } catch (error) {
      // Parse TRPC validation errors to extract user-friendly message
      let errorMsg = 'Failed to send notification';
      
      if (error instanceof Error) {
        errorMsg = error.message;
        
        // Check for TRPC error structure (error.data?.zodError?.issues)
        const trpcError = error as any;
        if (trpcError?.data?.zodError?.issues && Array.isArray(trpcError.data.zodError.issues)) {
          const issues = trpcError.data.zodError.issues;
          if (issues.length > 0) {
            // Extract the first validation error message
            const firstIssue = issues[0];
            errorMsg = firstIssue.message || errorMsg;
          }
        } else {
          // Try to parse JSON validation errors from error message
          try {
            const parsed = JSON.parse(error.message);
            if (Array.isArray(parsed) && parsed.length > 0) {
              // Extract first validation error message
              const firstError = parsed[0];
              if (firstError.message) {
                errorMsg = firstError.message;
              }
            }
          } catch {
            // If not JSON, use the error message as is
            errorMsg = error.message;
          }
        }
      }
      
      setErrorMessage(errorMsg);
    }
  };

  // Format date and time for display
  const formatDateTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
    const time = now.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
    return { date, time };
  };

  const dateTime = formatDateTime();

  if (!isOpen) return null;

  // Step 1: Send notification form
  const renderStep1 = () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 p-4 rounded-medium">
        <h3 className="text-lg font-semibold">{dictionary.notificationContent}</h3>
        
        <TextAreaInput
          label={dictionary.messageLabel}
          value={message}
          setValue={setMessage}
          placeholder={dictionary.messagePlaceholder}
        />
        {hasAttemptedSubmit && !isMessageValid && (
          <p className="text-sm text-feedback-error-primary">
            {dictionary.validationErrors?.messageRequired || 'Message is required (max 120 characters)'}
          </p>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-sm text-text-secondary">{dictionary.linkTitleLabel}</label>
          <InputField
            value={actionTitle}
            setValue={setActionTitle}
            inputText={dictionary.linkTitlePlaceholder}
            state={hasAttemptedSubmit && !isActionTitleValid ? 'error' : 'placeholder'}
          />
          {hasAttemptedSubmit && !isActionTitleValid && (
            <p className="text-sm text-feedback-error-primary">
              Link title is required
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-text-secondary">{dictionary.urlLabel}</label>
          <InputField
            value={actionUrl}
            setValue={setActionUrl}
            inputText={dictionary.urlPlaceholder}
            state={hasAttemptedSubmit && !isActionUrlValid ? 'error' : 'placeholder'}
            type="url"
          />
          {hasAttemptedSubmit && !isActionUrlValid && (
            <p className="text-sm text-feedback-error-primary">
              {actionUrl.trim().length === 0 
                ? 'URL is required' 
                : (dictionary.validationErrors?.urlInvalid || 'Please enter a valid URL')}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">{dictionary.recipients}</h3>
          <Badge text={recipients.length.toString()} variant="info" size="small" />
        </div>
        <div className="h-[300px]">
          <BaseGrid
            gridRef={recipientsGridRef}
            locale={locale}
            columnDefs={recipientsColumnDefs}
            rowData={recipients}
            enableCellTextSelection={true}
            pagination={false}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-9 p-4">
        <Button
          variant="primary"
          size="medium"
          text={dictionary.nextButton}
          onClick={handleNext}
          disabled={!isFormValid}
          hasIconRight
          iconRight={<IconChevronRight />}
          title={!isFormValid ? `Validation: message=${isMessageValid}, title=${isActionTitleValid}, url=${isActionUrlValid}, recipients=${recipients.length > 0}` : undefined}
        />
        <Button
          variant="text"
          size="medium"
          text={dictionary.close}
          onClick={onClose}
        />
      </div>
    </div>
  );

  // Step 2: Review details
  const renderStep2 = () => (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">{dictionary.step2Title}</h3>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Activity
            message={message}
            action={(actionTitle && actionUrl ? { title: actionTitle, url: actionUrl } : { title: '', url: '' }) as { title: string; url: string }}
            timestamp={new Date().toISOString()}
            isRead={false}
            platformName=""
            recipients={recipients.length}
            layout="horizontal"
            locale={locale}
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm text-text-secondary">
            {recipients.length} {dictionary.recipientsCountLabel || 'recipients'}
          </p>
          <p className="text-sm text-text-secondary">
            {dictionary.dateAndTime}: {dateTime.date} {dateTime.time}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="text-md font-semibold">{dictionary.recipients}</h4>
        <div className="h-[300px]">
          <BaseGrid
            gridRef={recipientsGridRef}
            locale={locale}
            columnDefs={recipientsColumnDefs}
            rowData={recipients}
            enableCellTextSelection={true}
            pagination={false}
          />
        </div>
      </div>

      {errorMessage && (
        <FeedBackMessage type="error" message={errorMessage} />
      )}

      <div className="flex flex-col gap-2">
        <Button
          variant="primary"
          size="medium"
          text={dictionary.sendNotificationButton}
          onClick={handleSend}
          disabled={!isFormValid || isSending}
          hasIconRight
          iconRight={<IconSendEmail />}
        />
        <Button
          variant="text"
          size="medium"
          text={dictionary.backToEdit}
          onClick={handleBack}
          disabled={isSending}
        />
      </div>
    </div>
  );

  // Step 3: Success
  const renderStep3 = () => (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">
        {dictionaryFormat(dictionary.step3Title, { count: recipientCount ?? recipients.length })}
      </h3>
      
      <Activity
        message={message}
        action={(actionTitle && actionUrl ? { title: actionTitle, url: actionUrl } : { title: '', url: '' }) as { title: string; url: string }}
        timestamp={new Date().toISOString()}
        isRead={false}
        platformName=""
        recipients={recipientCount ?? recipients.length}
        layout="horizontal"
        locale={locale}
      />

      <Button
        variant="primary"
        size="medium"
        text={dictionary.close}
        onClick={onClose}
      />
    </div>
  );

  const getTitle = () => {
    if (currentStep === 1) return dictionary.step1Title;
    if (currentStep === 2) return dictionary.step2Title;
    return dictionaryFormat(dictionary.step3Title, { count: recipientCount ?? recipients.length });
  };

  return (
    <div
      className="fixed inset-0 bg-transparent backdrop-blur-xs flex items-center justify-center z-[1100]"
      onClick={onClose}
    >
      <div
        className="flex flex-col gap-4 p-6 bg-card-fill border border-card-stroke text-text-primary w-full max-w-[800px] max-h-[80vh] overflow-y-auto rounded-md mx-4 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{getTitle()}</h2>
          {currentStep !== 3 && (
            <Button
              variant="text"
              size="small"
              hasIconLeft
              iconLeft={<IconClose size="6" />}
              onClick={onClose}
              disabled={isSending}
            />
          )}
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-divider"></div>

        {/* Content */}
        <div className="flex flex-col gap-4">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>
      </div>
    </div>
  );
};

