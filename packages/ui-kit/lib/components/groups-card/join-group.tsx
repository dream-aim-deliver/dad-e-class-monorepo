import { FC } from 'react';
import { Button } from '../button';
import { TextInput } from '../text-input';
import { cn } from '../../utils/style-utils';
import { TLocale, getDictionary } from '@maany_shr/e-class-translations';

interface JoinGroupProps {
  locale: TLocale;
  couponCode?: string;
  onCouponCodeChange?: (value: string) => void;
  onValidateCode?: () => void;
  isValidating?: boolean;
  hasValidationMessage?: boolean;
  validationMessage?: string;
  validationMessageType?: 'error' | 'success';
  className?: string;
}

/**
 * JoinGroup component for entering a coupon code to join a group
 * 
 * @param locale - The locale for translations
 * @param couponCode - Current coupon code value
 * @param onCouponCodeChange - Callback for coupon code changes
 * @param onValidateCode - Callback for validating the coupon code
 * @param isValidating - Whether validation is in progress
 * @param hasValidationMessage - Whether there is a validation message to show
 * @param validationMessage - Error/validation message to display
 * @param validationMessageType - Type of validation message ('error' or 'success')
 * @param className - Additional CSS classes
 */
export const JoinGroup: FC<JoinGroupProps> = ({
  locale,
  couponCode = '',
  onCouponCodeChange,
  onValidateCode,
  isValidating = false,
  hasValidationMessage = false,
  validationMessage,
  validationMessageType = 'error',
  className,
}) => {
  const dictionary = getDictionary(locale);

  return (
    <div
      className={cn(
        'flex flex-col bg-card-fill gap-4 text-sm md:text-md border border-card-stroke p-4 rounded-lg text-text-secondary h-fit',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col min-w-0">
          <h3 className="text-text-primary text-sm md:text-md leading-4 font-bold">
            {dictionary.components.joinGroup.title}
          </h3>
        </div>
      </div>

      {/* Description */}
      <p className="text-text-secondary leading-[150%]">
        {dictionary.components.joinGroup.description}
      </p>

      {/* Form */}
      <div className="flex flex-col gap-4">
        {/* Coupon Code Input */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-text-primary">
            {dictionary.components.joinGroup.couponCodeLabel}
          </label>
          <TextInput
            inputField={{
              value: couponCode,
              setValue: (value: string) => {
                if (onCouponCodeChange) {
                  onCouponCodeChange(value);
                }
              },
              inputText: dictionary.components.joinGroup.couponCodePlaceholder,
            }}
            hasFeedback={hasValidationMessage}
            feedbackMessage={
              hasValidationMessage && validationMessage
                ? {
                    type: validationMessageType,
                    message: validationMessage,
                  }
                : undefined
            }
          />
        </div>

        {/* Validate Button */}
        <Button
          variant="primary"
          size="medium"
          onClick={onValidateCode}
          text={isValidating ? dictionary.components.joinGroup.validating : dictionary.components.joinGroup.validateCode}
          disabled={!couponCode.trim() || isValidating}
        />
      </div>
    </div>
  );
};

export default JoinGroup;